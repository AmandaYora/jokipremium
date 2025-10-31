import { useEffect, useMemo, useState, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { RefreshCcw, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SessionSummary {
  sessionId: string;
  messageCount: number;
  done: boolean;
  lastRole: string;
  lastText: string;
  updatedAt: string;
}

interface SessionsResponse {
  ok: boolean;
  sessions: SessionSummary[];
}

interface DeleteResponse {
  ok: boolean;
  deleted: string[];
  missing: string[];
  errors: Array<{ sessionId: string; message: string }>;
}

const resolveSessionsEndpoint = () => {
  const userDefined = import.meta.env.VITE_MINJO_SESSIONS_URL as string | undefined;
  if (userDefined && userDefined.trim().length > 0) {
    const normalized = userDefined.replace(/\/+$/, "");
    return normalized.endsWith("/sessions") ? normalized : `${normalized}/sessions`;
  }
  // Default ke /api/sessions yang akan di-proxy ke AI backend
  return "/api/sessions";
};

const SNIPPET_WORD_LIMIT = 25;

const parseJsonResponse = <T,>(rawPayload: string): T => {
  try {
    return JSON.parse(rawPayload) as T;
  } catch (error) {
    const snippet = rawPayload
      .replace(/[\r\n]+/g, " ")
      .split(" ")
      .filter(Boolean)
      .slice(0, SNIPPET_WORD_LIMIT)
      .join(" ");
    console.error("Sessions API returned non-JSON payload snippet:", snippet, error);
    throw new Error("Server mengembalikan format tidak valid untuk data sesi.");
  }
};

const Sessions = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);

  const sessionsEndpoint = useMemo(() => resolveSessionsEndpoint(), []);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(sessionsEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Gagal memuat sesi (status ${response.status})`);
      }

      const rawPayload = await response.text();
      const data = parseJsonResponse<SessionsResponse>(rawPayload);
      if (!data.ok || !Array.isArray(data.sessions)) {
        throw new Error("Format data sesi tidak valid");
      }

      setSessions(data.sessions);
      setSelectedIds((previous) =>
        previous.filter((sessionId) => data.sessions.some((session) => session.sessionId === sessionId)),
      );
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat sesi");
      toast({
        title: "Gagal memuat sesi",
        description: err instanceof Error ? err.message : "Silakan coba lagi beberapa saat.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [sessionsEndpoint, toast]);

  useEffect(() => {
    void fetchSessions();
  }, [fetchSessions]);

  const allSelected = sessions.length > 0 && selectedIds.length === sessions.length;
  const isIndeterminate = !allSelected && selectedIds.length > 0;

  const toggleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedIds(sessions.map((session) => session.sessionId));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleRowSelection = (sessionId: string, checked: boolean | "indeterminate") => {
    setSelectedIds((prev) => {
      if (checked === true) {
        if (prev.includes(sessionId)) {
          return prev;
        }
        return [...prev, sessionId];
      }
      return prev.filter((id) => id !== sessionId);
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(sessionsEndpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionIds: selectedIds }),
      });

      if (!response.ok) {
        throw new Error(`Gagal menghapus sesi (status ${response.status})`);
      }

      const rawPayload = await response.text();
      const result = parseJsonResponse<DeleteResponse>(rawPayload);

      const deletedIds = Array.isArray(result.deleted) ? result.deleted : [];
      const missingIds = Array.isArray(result.missing) ? result.missing : [];
      const errorEntries = Array.isArray(result.errors) ? result.errors : [];

      if (deletedIds.length > 0) {
        setSessions((prev) => prev.filter((session) => !deletedIds.includes(session.sessionId)));
        setSelectedIds((prev) => prev.filter((id) => !deletedIds.includes(id)));
      }

      if (errorEntries.length === 0 && missingIds.length === 0) {
        toast({
          title: "Sesi dihapus",
          description: `${deletedIds.length} sesi berhasil dihapus.`,
        });
      } else {
        const issues: string[] = [];
        if (missingIds.length > 0) {
          issues.push(`Tidak ditemukan: ${missingIds.join(", ")}`);
        }
        if (errorEntries.length > 0) {
          issues.push(
            errorEntries
              .map((entry) => `${entry.sessionId}: ${entry.message ?? "Gagal dihapus"}`)
              .join("; "),
          );
        }

        toast({
          title: deletedIds.length > 0 ? "Sebagian sesi terhapus" : "Gagal menghapus sesi",
          description: issues.join(" | "),
          variant: deletedIds.length > 0 ? "default" : "destructive",
        });
      }
    } catch (err) {
      console.error("Failed to delete sessions:", err);
      toast({
        title: "Gagal menghapus sesi",
        description: err instanceof Error ? err.message : "Silakan coba lagi beberapa saat.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gradient">Sesi AI Chat</h1>
              <p className="text-muted-foreground">
                Lihat dan kelola sesi percakapan Minjo yang sedang berlangsung maupun arsip.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => void fetchSessions()}
                disabled={loading}
                className="inline-flex items-center gap-2"
              >
                <RefreshCcw className="h-4 w-4" />
                Muat ulang
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="inline-flex items-center gap-2"
                disabled={selectedIds.length === 0 || deleting}
                onClick={() => void handleDeleteSelected()}
              >
                <Trash2 className="h-4 w-4" />
                Hapus terpilih
              </Button>
            </div>
          </div>
          {selectedIds.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {selectedIds.length} sesi dipilih untuk dihapus.
            </p>
          )}
          {error && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3">
                    <Checkbox
                      checked={allSelected ? true : isIndeterminate ? "indeterminate" : false}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Pilih semua sesi"
                    />
                  </th>
                  <th className="px-4 py-3 font-semibold">Session ID</th>
                  <th className="px-4 py-3 font-semibold">Aktivitas Terakhir</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Pesan Terakhir</th>
                  <th className="px-4 py-3 font-semibold text-right">Jumlah Pesan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/80">
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={`skeleton-${index}`} className="animate-pulse">
                      <td className="px-4 py-4">
                        <div className="h-4 w-4 rounded bg-muted" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-4 w-36 rounded bg-muted" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-4 w-28 rounded bg-muted" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-5 w-20 rounded-full bg-muted" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-4 w-full max-w-xs rounded bg-muted" />
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="ml-auto h-4 w-10 rounded bg-muted" />
                      </td>
                    </tr>
                  ))
                ) : sessions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      Belum ada sesi yang tercatat.
                    </td>
                  </tr>
                ) : (
                  sessions.map((session) => {
                    const updatedDate =
                      session.updatedAt && !Number.isNaN(Date.parse(session.updatedAt))
                        ? new Date(session.updatedAt)
                        : null;
                    const lastUpdated = updatedDate
                      ? formatDistanceToNow(updatedDate, { addSuffix: true })
                      : "-";

                    const isSelected = selectedIds.includes(session.sessionId);

                    return (
                      <tr
                        key={session.sessionId}
                        className={`transition-colors ${
                          isSelected ? "bg-primary/5" : "hover:bg-muted/20"
                        }`}
                      >
                        <td className="px-4 py-3 align-top">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => toggleRowSelection(session.sessionId, checked)}
                            aria-label={`Pilih sesi ${session.sessionId}`}
                          />
                        </td>
                        <td className="px-4 py-3 align-top">
                          <div className="font-semibold text-foreground">{session.sessionId}</div>
                          <div className="text-xs text-muted-foreground capitalize">{session.lastRole || "-"}</div>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <div className="text-sm text-foreground">{lastUpdated}</div>
                          <div className="text-xs text-muted-foreground">
                            {updatedDate ? updatedDate.toLocaleString() : "Tanggal tidak tersedia"}
                          </div>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <Badge variant={session.done ? "secondary" : "outline"} className="uppercase tracking-wide">
                            {session.done ? "Selesai" : "Aktif"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <p className="text-sm text-muted-foreground line-clamp-2 max-w-md">
                            {session.lastText || "—"}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-right align-top">
                          <span className="font-semibold text-foreground">{session.messageCount}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Sessions;
