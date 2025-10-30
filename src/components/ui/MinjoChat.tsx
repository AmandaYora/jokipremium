import React, { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";

type ChatRole = "user" | "assistant" | "system";

interface ChatMessage {
  id: string;
  role: ChatRole;
  segments: string[];
  variant?: "default" | "error";
}

// Use same-origin proxy by default to avoid CORS issues; override via env if needed.
const CHAT_ENDPOINT =
  import.meta.env.VITE_MINJO_CHAT_URL ??
  "/api/minjo";

const formatDate = (date: Date) => date.toISOString().split("T")[0];

const createSegments = (raw: string) =>
  raw
    .split("\n\n")
    .map((segment) => segment.trim())
    .filter(Boolean);

const generateId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const MinjoChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: generateId(),
      role: "assistant",
      segments: [
        "Halo! Aku Minjo, asisten AI JokiPremium. Ceritakan kebutuhan aplikasi atau skripsi kamu, yuk.",
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const bottomMarkerRef = useRef<HTMLDivElement | null>(null);
  const hasAutoScrolledRef = useRef(false);

  const fallbackSessionId = useMemo(() => {
    const today = formatDate(new Date());
    return `anonymous-${today}`;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const resolveSessionId = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        if (!response.ok) {
          throw new Error("Gagal mengambil IP");
        }
        const { ip } = (await response.json()) as { ip?: string };
        if (!ip) {
          throw new Error("IP tidak ditemukan");
        }
        if (isMounted) {
          const today = formatDate(new Date());
          setSessionId(`${ip}-${today}`);
        }
      } catch (error) {
        if (isMounted) {
          setSessionId(fallbackSessionId);
        }
      }
    };

    resolveSessionId();

    return () => {
      isMounted = false;
    };
  }, [fallbackSessionId]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  const pushMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleSend = async () => {
    const question = inputValue.trim();
    if (!question || isLoading) {
      return;
    }

    setInputValue("");
    pushMessage({
      id: generateId(),
      role: "user",
      segments: [question],
    });
    setIsLoading(true);

    const currentSession = sessionId ?? fallbackSessionId;

    try {
      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: currentSession,
          question,
        }),
      });

      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }

      const data = (await response.json()) as { ok?: boolean; answer?: string };
      if (!data?.ok || typeof data.answer !== "string") {
        throw new Error("Format respons tidak valid");
      }

      const segments = createSegments(data.answer);
      pushMessage({
        id: generateId(),
        role: "assistant",
        segments: segments.length
          ? segments
          : ["Minjo belum menerima jawaban dari server. Coba lagi sebentar lagi, ya."],
      });
    } catch (error) {
      pushMessage({
        id: generateId(),
        role: "assistant",
        segments: [
          "Maaf, Minjo mengalami kendala koneksi. Silakan coba lagi sebentar lagi.",
        ],
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      hasAutoScrolledRef.current = false;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const behavior: ScrollBehavior = hasAutoScrolledRef.current ? "smooth" : "auto";
    const marker = bottomMarkerRef.current;

    if (marker) {
      requestAnimationFrame(() => {
        marker.scrollIntoView({ behavior, block: "end" });
      });
      hasAutoScrolledRef.current = true;
    }
  }, [messages, isLoading, isOpen]);

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? "Tutup chat Minjo" : "Buka chat Minjo"}
        onClick={handleToggle}
        className={`fixed z-[80] bottom-6 right-6 rounded-full px-5 py-3 font-semibold shadow-glow text-foreground transition-smooth bg-gradient-brand hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent focus-visible:ring-offset-background
          max-sm:right-4 max-sm:bottom-4
        `}
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10">
            <MessageCircle className="h-5 w-5" />
          </span>
          <span>Minjo</span>
        </div>
      </button>

      {isOpen && (
        <div
          className="fixed z-[90] bottom-24 right-6 w-[22rem] max-h-[70vh] rounded-3xl border border-border/60 bg-card/90 backdrop-blur-xl shadow-brand transition-smooth overflow-hidden
            max-sm:right-3 max-sm:left-3 max-sm:bottom-24 max-sm:w-auto"
        >
          <header className="flex items-center justify-between px-4 py-3 bg-gradient-brand text-foreground">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide">Minjo</p>
              <p className="text-xs text-foreground/80">
                Asisten AI JokiPremium siap bantu kamu.
              </p>
            </div>
            <button
              type="button"
              aria-label="Tutup chat Minjo"
              onClick={handleToggle}
              className="rounded-full p-1 text-foreground/80 hover:text-foreground hover:bg-foreground/10 transition-smooth"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div
            ref={scrollContainerRef}
            className="flex flex-col gap-2 px-4 py-4 overflow-y-auto max-h-[45vh] scroll-smooth minjo-scrollbar"
          >
            {messages.map((message) =>
              message.segments.map((segment, index) => (
                <div
                  key={`${message.id}-${index}`}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-card ${
                      message.role === "user"
                        ? "bg-gradient-brand text-foreground"
                        : message.variant === "error"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted/40 text-foreground"
                    }`}
                  >
                    {segment}
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-2xl px-4 py-3 text-sm bg-muted/40 text-muted-foreground shadow-card">
                  Minjo sedang menulis...
                </div>
              </div>
            )}
            <div ref={bottomMarkerRef} />
          </div>

          <div className="border-t border-border/50 bg-card/80 px-4 py-3">
            <div className="rounded-2xl border border-border bg-background/80 shadow-inner">
              <textarea
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={handleInputKeyDown}
                rows={2}
                placeholder="Tanyakan apa saja ke Minjo..."
                className="w-full resize-none bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <div className="flex items-center justify-between border-t border-border/60 px-3 py-2">
                <p className="text-[11px] text-muted-foreground">
                  Tekan Enter untuk kirim, Shift+Enter untuk baris baru.
                </p>
                <button
                  type="button"
                  onClick={() => void handleSend()}
                  disabled={isLoading || !inputValue.trim()}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground transition-smooth hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Kirim
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MinjoChat;
