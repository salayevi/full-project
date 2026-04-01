"use client";

import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { ApiError, getFooter, saveFooter } from "@/lib/api";
import type { FooterCallToAction, FooterContactItem, FooterRecord, FooterSocialLink } from "@/lib/types";
import { EmptyState } from "@/components/shared/empty-state";
import { LivePreviewPanel } from "@/components/shared/live-preview-panel";
import { Panel } from "@/components/shared/panel";
import { StatusBadge } from "@/components/shared/status-badge";
import { useLivePreview } from "@/lib/use-live-preview";

const createContact = (): FooterContactItem => ({ label: "", value: "", href: "" });
const createSocial = (): FooterSocialLink => ({ label: "", href: "" });
const initialCta: FooterCallToAction = {
  title: "",
  description: "",
  primary_label: "",
  primary_mode: "login",
  secondary_label: "",
  secondary_href: "",
};

const initialFooter: FooterRecord = {
  brand_text: "",
  description: "",
  contact_items: [createContact()],
  social_links: [createSocial()],
  cta: initialCta,
  legal_text: "",
  preview_note: "",
  publish_state: "draft",
  visibility_state: "visible",
};

export function FooterForm() {
  const [form, setForm] = useState<FooterRecord>(initialFooter);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getFooter()
      .then((payload) => setForm(payload))
      .catch((err) => {
        if (!(err instanceof ApiError) || err.status !== 404) {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, []);
  const livePreview = useLivePreview(
    "footer",
    {
      brand_text: form.brand_text,
      description: form.description,
      contact_items: form.contact_items,
      social_links: form.social_links,
      cta_payload: form.cta,
      legal_text: form.legal_text,
      publish_state: form.publish_state,
      visibility_state: form.visibility_state,
    },
    Boolean(form.brand_text)
  );

  const updateField = <K extends keyof FooterRecord>(key: K, value: FooterRecord[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateContact = <K extends keyof FooterContactItem>(index: number, key: K, value: FooterContactItem[K]) => {
    setForm((current) => ({
      ...current,
      contact_items: current.contact_items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    }));
  };

  const updateSocial = <K extends keyof FooterSocialLink>(index: number, key: K, value: FooterSocialLink[K]) => {
    setForm((current) => ({
      ...current,
      social_links: current.social_links.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    }));
  };

  const updateCta = <K extends keyof FooterCallToAction>(key: K, value: FooterCallToAction[K]) => {
    setForm((current) => ({ ...current, cta: { ...current.cta, [key]: value } }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = await saveFooter({
        brand_text: form.brand_text,
        description: form.description,
        contact_items: form.contact_items.filter((item) => item.label || item.value),
        social_links: form.social_links.filter((item) => item.label || item.href),
        cta_payload: form.cta,
        legal_text: form.legal_text,
        preview_note: form.preview_note,
        publish_state: form.publish_state,
        visibility_state: form.visibility_state,
      });
      setForm(payload);
      setSuccess("Footer section saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save footer section.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="muted-text">Loading footer section...</p>;
  }

  return (
    <div className="workspace-grid two-columns">
      <Panel title="Footer editor" subtitle="Control the public footer copy, contact blocks, social links, and CTA content from one place.">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Brand text
            <input value={form.brand_text} onChange={(event) => updateField("brand_text", event.target.value)} required />
          </label>
          <label>
            Publish state
            <select value={form.publish_state} onChange={(event) => updateField("publish_state", event.target.value as FooterRecord["publish_state"])}>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label>
            Preview note
            <input value={form.preview_note} onChange={(event) => updateField("preview_note", event.target.value)} />
          </label>
          <label>
            Visibility
            <select value={form.visibility_state} onChange={(event) => updateField("visibility_state", event.target.value as FooterRecord["visibility_state"])}>
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </select>
          </label>
          <label className="full-span">
            Description
            <textarea rows={4} value={form.description} onChange={(event) => updateField("description", event.target.value)} />
          </label>
          <label className="full-span">
            Legal text
            <input value={form.legal_text} onChange={(event) => updateField("legal_text", event.target.value)} />
          </label>

          <div className="full-span nested-section">
            <div className="section-header-row">
              <div>
                <h3>Contact items</h3>
                <p>Contact data shown in the public footer.</p>
              </div>
              <button type="button" className="secondary-button" onClick={() => setForm((current) => ({ ...current, contact_items: [...current.contact_items, createContact()] }))}>
                <Plus size={16} />
                Add contact
              </button>
            </div>
            <div className="stack-list">
              {form.contact_items.map((item, index) => (
                <div key={`contact-${index}`} className="stack-card">
                  <div className="stack-card-toolbar">
                    <strong>Contact {index + 1}</strong>
                    <button
                      type="button"
                      className="ghost-button danger-text"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          contact_items: current.contact_items.filter((_, itemIndex) => itemIndex !== index),
                        }))
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="subgrid three-up">
                    <label>
                      Label
                      <input value={item.label} onChange={(event) => updateContact(index, "label", event.target.value)} />
                    </label>
                    <label>
                      Value
                      <input value={item.value} onChange={(event) => updateContact(index, "value", event.target.value)} />
                    </label>
                    <label>
                      Href
                      <input value={item.href || ""} onChange={(event) => updateContact(index, "href", event.target.value)} />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="full-span nested-section">
            <div className="section-header-row">
              <div>
                <h3>Social links</h3>
                <p>External profile links used in the public footer.</p>
              </div>
              <button type="button" className="secondary-button" onClick={() => setForm((current) => ({ ...current, social_links: [...current.social_links, createSocial()] }))}>
                <Plus size={16} />
                Add social
              </button>
            </div>
            <div className="stack-list">
              {form.social_links.map((item, index) => (
                <div key={`social-${index}`} className="stack-card">
                  <div className="stack-card-toolbar">
                    <strong>Link {index + 1}</strong>
                    <button
                      type="button"
                      className="ghost-button danger-text"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          social_links: current.social_links.filter((_, itemIndex) => itemIndex !== index),
                        }))
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="subgrid two-up">
                    <label>
                      Label
                      <input value={item.label} onChange={(event) => updateSocial(index, "label", event.target.value)} />
                    </label>
                    <label>
                      Href
                      <input value={item.href} onChange={(event) => updateSocial(index, "href", event.target.value)} />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="full-span nested-section">
            <div className="section-header-row">
              <div>
                <h3>Footer CTA</h3>
                <p>Structured login/register CTA block for the public footer.</p>
              </div>
            </div>
            <div className="subgrid two-up">
              <label>
                Title
                <input value={form.cta.title} onChange={(event) => updateCta("title", event.target.value)} />
              </label>
              <label>
                Primary mode
                <select value={form.cta.primary_mode} onChange={(event) => updateCta("primary_mode", event.target.value as FooterCallToAction["primary_mode"])}>
                  <option value="login">Login</option>
                  <option value="register">Register</option>
                </select>
              </label>
              <label className="full-span">
                Description
                <textarea rows={3} value={form.cta.description} onChange={(event) => updateCta("description", event.target.value)} />
              </label>
              <label>
                Primary label
                <input value={form.cta.primary_label} onChange={(event) => updateCta("primary_label", event.target.value)} />
              </label>
              <label>
                Secondary label
                <input value={form.cta.secondary_label} onChange={(event) => updateCta("secondary_label", event.target.value)} />
              </label>
              <label className="full-span">
                Secondary href
                <input value={form.cta.secondary_href} onChange={(event) => updateCta("secondary_href", event.target.value)} />
              </label>
            </div>
          </div>

          {error ? <p className="form-error full-span">{error}</p> : null}
          {success ? <p className="form-success full-span">{success}</p> : null}

          <div className="full-span form-actions">
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? "Saving..." : "Save footer section"}
            </button>
          </div>
        </form>
      </Panel>

      <Panel title="Preview" subtitle="A live footer structure preview driven by the real backend payload shape.">
        {form.brand_text ? (
          <div className="footer-preview">
            <div className="inline-actions">
              <StatusBadge state={form.publish_state} />
              <span className="mini-pill">{form.visibility_state}</span>
            </div>
            <h3>{form.brand_text}</h3>
            <p>{form.description || "Footer description preview appears here."}</p>
            <div className="footer-preview-grid">
              <div>
                <strong>Contact</strong>
                {form.contact_items.map((item, index) => (
                  <p key={`contact-preview-${index}`}>{item.label}: {item.value}</p>
                ))}
              </div>
              <div>
                <strong>Social</strong>
                {form.social_links.map((item, index) => (
                  <p key={`social-preview-${index}`}>{item.label}: {item.href}</p>
                ))}
              </div>
            </div>
            <div className="cta-preview-card">
              <small>{form.cta.primary_mode.toUpperCase()} CTA</small>
              <h4>{form.cta.title || "Footer CTA preview"}</h4>
              <p>{form.cta.description || "CTA description preview."}</p>
              <div className="inline-actions">
                {form.cta.primary_label ? <button type="button" className="primary-button">{form.cta.primary_label}</button> : null}
                {form.cta.secondary_label ? <button type="button" className="secondary-button">{form.cta.secondary_label}</button> : null}
              </div>
            </div>
          </div>
        ) : (
          <EmptyState title="Footer not configured" message="Save the footer structure to activate the real public footer source." />
        )}
      </Panel>

      <div className="full-span">
        <LivePreviewPanel
          title="Public website preview"
          subtitle="Tokenized footer preview before persisting to the real content source."
          previewUrl={livePreview.previewUrl}
          snapshotUrl={livePreview.snapshotUrl}
          loading={livePreview.loading}
          error={livePreview.error}
        />
      </div>
    </div>
  );
}
