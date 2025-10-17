import { useEffect, useRef, useCallback } from 'react';

const ANALYTICS_URL = `https://iuncnthcxlbbggzoixwq.supabase.co/functions/v1/analytics-collect`;
// This key must match the ANALYTICS_KEY secret in Supabase
// It's a simple protection mechanism to prevent spam
const ANALYTICS_KEY = 'lovable_analytics_2025_v1';

interface AnalyticsEvent {
  type: 'pageview' | 'section_focus';
  mode?: 'gps' | 'ip';
  lat?: number;
  lon?: number;
  accuracy?: number;
  path?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  section_id?: string;
  delta_ms?: number;
}

let locationAttempted = false;
let gpsLocation: { lat: number; lon: number; accuracy: number } | null = null;

async function sendAnalyticsEvent(event: AnalyticsEvent) {
  try {
    await fetch(ANALYTICS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-analytics-key': ANALYTICS_KEY,
      },
      body: JSON.stringify(event),
    });
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

function attemptGPSLocation(): Promise<{ lat: number; lon: number; accuracy: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    const timeout = setTimeout(() => {
      resolve(null);
    }, 4000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeout);
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      () => {
        clearTimeout(timeout);
        resolve(null);
      },
      { enableHighAccuracy: true, timeout: 4000, maximumAge: 0 }
    );
  });
}

export function usePageviewTracking() {
  useEffect(() => {
    const trackPageview = async () => {
      if (!locationAttempted) {
        locationAttempted = true;
        gpsLocation = await attemptGPSLocation();
      }

      const params = new URLSearchParams(window.location.search);
      const event: AnalyticsEvent = {
        type: 'pageview',
        path: window.location.pathname,
        referrer: document.referrer || undefined,
        utm_source: params.get('utm_source') || undefined,
        utm_medium: params.get('utm_medium') || undefined,
        utm_campaign: params.get('utm_campaign') || undefined,
      };

      if (gpsLocation) {
        event.mode = 'gps';
        event.lat = gpsLocation.lat;
        event.lon = gpsLocation.lon;
        event.accuracy = gpsLocation.accuracy;
      }

      await sendAnalyticsEvent(event);
    };

    trackPageview();
  }, []);
}

export function useSectionFocusTracking(sectionId: string) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const intervalRef = useRef<number | null>(null);
  const isVisibleRef = useRef(false);
  const elementRef = useRef<HTMLElement | null>(null);

  const sendFocusEvent = useCallback(() => {
    if (!isVisibleRef.current) return;
    if (document.visibilityState !== 'visible') return;
    if (!document.hasFocus()) return;

    sendAnalyticsEvent({
      type: 'section_focus',
      section_id: sectionId,
      delta_ms: 2000,
    });
  }, [sectionId]);

  const startTracking = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = window.setInterval(sendFocusEvent, 2000);
  }, [sendFocusEvent]);

  const stopTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && document.hasFocus() && isVisibleRef.current) {
        startTracking();
      } else {
        stopTracking();
      }
    };

    const handleBlur = () => {
      stopTracking();
    };

    const handleFocus = () => {
      if (document.visibilityState === 'visible' && isVisibleRef.current) {
        startTracking();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('pagehide', stopTracking);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pagehide', stopTracking);
      stopTracking();
    };
  }, [startTracking, stopTracking]);

  const attachToElement = useCallback((element: HTMLElement | null) => {
    if (!element) return;
    elementRef.current = element;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.5) {
            isVisibleRef.current = true;
            if (document.visibilityState === 'visible' && document.hasFocus()) {
              startTracking();
            }
          } else {
            isVisibleRef.current = false;
            stopTracking();
          }
        });
      },
      { threshold: 0.5 }
    );

    observerRef.current.observe(element);
  }, [startTracking, stopTracking]);

  useEffect(() => {
    return () => {
      if (observerRef.current && elementRef.current) {
        observerRef.current.unobserve(elementRef.current);
      }
      stopTracking();
    };
  }, [stopTracking]);

  return attachToElement;
}
