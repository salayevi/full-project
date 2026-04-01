"use client";

import { useEffect, useState } from "react";

import { getAuditLogs } from "@/lib/api";
import type { AuditLog } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import { Panel } from "@/components/shared/panel";
import { StatusBadge } from "@/components/shared/status-badge";

export default function ActivityPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAuditLogs().then(setLogs).catch((err) => setError(err.message));
  }, []);

  return (
    <Panel title="Activity logs" subtitle="Audit records from the Django backend core.">
      {error ? <EmptyState title="Audit logs unavailable" message={error} /> : null}
      {!error && logs.length === 0 ? <EmptyState title="No audit logs yet" message="Audit records will appear as soon as operators authenticate or change content." /> : null}
      <div className="activity-list">
        {logs.map((log) => (
          <article key={log.id} className="activity-item">
            <div>
              <div className="inline-actions">
                <strong>{log.message}</strong>
                <StatusBadge state={log.action === "created" ? "published" : log.action === "deleted" ? "archived" : "review"} />
              </div>
              <p>{log.actor_email || "system"} · {log.target_app || "core"} / {log.target_model || "event"}</p>
            </div>
            <time>{formatDate(log.created_at)}</time>
          </article>
        ))}
      </div>
    </Panel>
  );
}
