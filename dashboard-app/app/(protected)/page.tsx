"use client";

import { useEffect, useState } from "react";

import { getOverview } from "@/lib/api";
import type { OverviewResponse } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import { Panel } from "@/components/shared/panel";
import { StatusBadge } from "@/components/shared/status-badge";

export default function OverviewPage() {
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getOverview().then(setOverview).catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <EmptyState title="Overview unavailable" message={error} />;
  }

  if (!overview) {
    return <p className="muted-text">Loading operational summary...</p>;
  }

  return (
    <div className="overview-grid">
      <div className="stat-strip">
        <article className="stat-card">
          <span>Products</span>
          <strong>{overview.counts.products.total}</strong>
          <p>{overview.counts.products.published} published / {overview.counts.products.draft} draft</p>
        </article>
        <article className="stat-card">
          <span>Media assets</span>
          <strong>{overview.counts.media.total}</strong>
          <p>{overview.counts.media.public} public-ready assets</p>
        </article>
        <article className="stat-card">
          <span>Operators</span>
          <strong>{overview.counts.users.total}</strong>
          <p>{overview.counts.users.staff} staff / {overview.counts.users.super_admin} super admins</p>
        </article>
        <article className="stat-card">
          <span>Achievements</span>
          <strong>{overview.counts.achievements.total}</strong>
          <p>{overview.counts.achievements.published} published cards</p>
        </article>
      </div>

      <Panel title="System readiness" subtitle="Live structural signals from the Django backend core.">
        <div className="readiness-list">
          <div className="readiness-item">
            <div>
              <strong>Site settings</strong>
              <p>Global brand and support metadata</p>
            </div>
            <StatusBadge state={overview.modules.site_settings.configured ? "ready" : "inactive"} />
          </div>
          <div className="readiness-item">
            <div>
              <strong>Theme tokens</strong>
              <p>Semantic color layer for future public rendering</p>
            </div>
            <StatusBadge state={overview.modules.site_settings.theme_ready ? "ready" : "inactive"} />
          </div>
          <div className="readiness-item">
            <div>
              <strong>Hero content</strong>
              <p>Primary hero source of truth</p>
            </div>
            <StatusBadge state={overview.modules.hero.published ? "published" : overview.modules.hero.configured ? "draft" : "inactive"} />
          </div>
          <div className="readiness-item">
            <div>
              <strong>About section</strong>
              <p>Structured section with ordered story lines</p>
            </div>
            <StatusBadge state={overview.modules.about.published ? "published" : overview.modules.about.configured ? "draft" : "inactive"} />
          </div>
          <div className="readiness-item">
            <div>
              <strong>Achievements</strong>
              <p>Ordered public cards with media and display theme</p>
            </div>
            <StatusBadge
              state={overview.modules.achievements.published ? "published" : overview.modules.achievements.configured ? "draft" : "inactive"}
            />
          </div>
          <div className="readiness-item">
            <div>
              <strong>Footer section</strong>
              <p>Contact, social, CTA, and legal content source</p>
            </div>
            <StatusBadge state={overview.modules.footer.published ? "published" : overview.modules.footer.configured ? "draft" : "inactive"} />
          </div>
        </div>
      </Panel>

      <Panel title="Recent activity" subtitle="Real audit events recorded by the backend.">
        {overview.recent_activity.length === 0 ? (
          <EmptyState title="No audit events yet" message="Actions from login, content edits, uploads, and product changes will appear here." />
        ) : (
          <div className="activity-list">
            {overview.recent_activity.map((item) => (
              <article key={item.id} className="activity-item">
                <div>
                  <strong>{item.message}</strong>
                  <p>{item.actor_email || "system"} · {item.target_app || "core"} / {item.target_model || "event"}</p>
                </div>
                <time>{formatDate(item.created_at)}</time>
              </article>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
