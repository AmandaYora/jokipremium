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

const shouldDropToken = (token: string) => {
  if (!token) {
    return true;
  }

  if (/^[-=_]{3,}$/.test(token)) {
    return true;
  }

  const letters = token.replace(/[^A-Za-z]/g, "");
  const digits = token.replace(/[^0-9]/g, "");
  const punctuationCount = token.length - letters.length - digits.length;

  if (letters.length === 0 && digits.length === 0) {
    return true;
  }

  if (punctuationCount >= 2 && letters.length <= 2 && digits.length === 0) {
    if (/[.+]/.test(token) && letters.length > 0) {
      return false;
    }

    if (token.includes("++")) {
      return false;
    }

    if (/[~`^<>]/.test(token)) {
      return true;
    }

    return true;
  }

  return false;
};

const sanitizeLine = (line: string) => {
  const withoutControl = line.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim();
  if (!withoutControl) {
    return "";
  }

  const prefixMatch = withoutControl.match(/^(\d+\.\s+|[-*]\s+)/);
  let prefix = "";
  let content = withoutControl;

  if (prefixMatch) {
    prefix = prefixMatch[1];
    content = withoutControl.slice(prefix.length);
  }

  const sanitizedContent = content
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => !shouldDropToken(token))
    .join(" ")
    .trim();

  if (!sanitizedContent) {
    return "";
  }

  return `${prefix}${sanitizedContent}`.trim();
};

const sanitizeSegment = (segment: string) => {
  const normalized = segment.replace(/\r\n/g, "\n");
  const sanitizedLines = normalized
    .split("\n")
    .map(sanitizeLine)
    .filter((line) => line.length > 0);

  return sanitizedLines.join("\n").trim();
};

const createSegments = (raw: string) =>
  raw
    .split(/\n\s*\n/)
    .map((segment) => sanitizeSegment(segment.trim()))
    .filter(Boolean);

const generateId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const renderInlineContent = (text: string, keyPrefix: string): React.ReactNode => {
  const boldRegex = /\*\*(.+?)\*\*/g;
  const parts: Array<string | React.ReactElement> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let matchIndex = 0;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    parts.push(
      <strong key={`${keyPrefix}-bold-${matchIndex}`} className="font-semibold">
        {match[1]}
      </strong>
    );

    lastIndex = match.index + match[0].length;
    matchIndex += 1;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  if (parts.length === 0) {
    return text;
  }

  return parts.map((part, index) =>
    typeof part === "string" ? (
      <React.Fragment key={`${keyPrefix}-text-${index}`}>{part}</React.Fragment>
    ) : (
      part
    )
  );
};

const renderSegmentContent = (segment: string, keyPrefix: string): React.ReactNode => {
  const lines = segment
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return null;
  }

  if (lines.length === 0) {
    return null;
  }

  const isNumberedList = lines.length > 1 && lines.every((line) => /^\d+\.\s+/.test(line));
  const isBulletedList = lines.length > 1 && lines.every((line) => /^[-*]\s+/.test(line));

  if (isNumberedList || isBulletedList) {
    const ListTag = (isNumberedList ? "ol" : "ul") as "ol" | "ul";
    const listClassName = isNumberedList ? "list-decimal" : "list-disc";

    return (
      <ListTag className={`space-y-2 ${listClassName} pl-5 text-left`}>
        {lines.map((line, index) => {
          const cleanedLine = line.replace(/^\d+\.\s+/, "").replace(/^[-*]\s+/, "");
          return (
            <li key={`${line}-${index}`} className="text-current">
              {renderInlineContent(cleanedLine, `${keyPrefix}-list-${index}`)}
            </li>
          );
        })}
      </ListTag>
    );
  }

  if (lines.length > 1) {
    return (
      <div className="space-y-2 text-left">
        {lines.map((line, index) => {
          const inlineContent = renderInlineContent(line, `${keyPrefix}-paragraph-${index}`);
          return (
            <p key={`${line}-${index}`} className="text-current">
              {inlineContent}
            </p>
          );
        })}
      </div>
    );
  }

  return <span>{renderInlineContent(lines[0], `${keyPrefix}-single`)}</span>;
};

const TypingIndicator = () => (
  <div className="flex items-center gap-2" role="status" aria-live="polite">
    <span className="sr-only">Minjo sedang menulis...</span>
    <div className="flex items-center gap-1" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, index) => (
        <span
          key={index}
          className="h-2.5 w-2.5 rounded-full bg-muted-foreground/80 animate-bounce"
          style={{ animationDelay: `${index * 0.2}s`, animationDuration: "1s" }}
        />
      ))}
    </div>
  </div>
);

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

      const rawPayload = await response.text();
      let data: { ok?: boolean; answer?: string; error?: string };

      try {
        data = JSON.parse(rawPayload) as { ok?: boolean; answer?: string; error?: string };
      } catch {
        const snippet = rawPayload
          .replace(/[\r\n]+/g, " ")
          .split(" ")
          .filter(Boolean)
          .slice(0, 30)
          .join(" ");
        console.error("MinjoChat received non-JSON response snippet:", snippet);
        throw new Error("Server mengembalikan format tidak valid. Silakan coba lagi sebentar lagi.");
      }

      if (!data?.ok || typeof data.answer !== "string") {
        throw new Error(data?.error || "Format respons tidak valid");
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
      console.error("MinjoChat fetch error:", error);
      const fallbackMessage =
        error instanceof Error
          ? error.message
          : "Maaf, Minjo mengalami kendala koneksi. Silakan coba lagi sebentar lagi.";
      pushMessage({
        id: generateId(),
        role: "assistant",
        segments: [
          fallbackMessage,
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

  <div
    aria-hidden="true"
    className={`fixed inset-0 z-[85] bg-background/70 transition-opacity duration-300 pointer-events-none ${
      isOpen ? "opacity-100 backdrop-blur-sm" : "opacity-0"
    }`}
  />

  {isOpen && (
    <div
          className="fixed z-[90] bottom-24 right-6 w-[22rem] min-h-[26rem] max-h-[80vh] rounded-3xl border border-border/60 bg-card/90 backdrop-blur-xl shadow-brand transition-smooth overflow-hidden
            max-sm:right-3 max-sm:left-3 max-sm:bottom-20 max-sm:w-auto max-sm:h-[80vh] max-sm:max-h-[80vh]"
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
            className="flex flex-col gap-3 px-4 py-5 overflow-y-auto max-h-[60vh] scroll-smooth min-h-[18rem] minjo-scrollbar
              max-sm:max-h-[55vh]"
          >
            {messages.map((message) =>
              message.segments.map((segment, index) => {
                const content = renderSegmentContent(segment, `${message.id}-${index}`);

                if (!content) {
                  return null;
                }

                return (
                  <div
                    key={`${message.id}-${index}`}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-left text-sm leading-relaxed shadow-card ${
                        message.role === "user"
                          ? "bg-gradient-brand text-foreground"
                          : message.variant === "error"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted/40 text-foreground"
                      }`}
                    >
                      {content}
                    </div>
                  </div>
                );
              })
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-2xl px-4 py-3 text-sm bg-muted/40 text-muted-foreground shadow-card">
                  <TypingIndicator />
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
