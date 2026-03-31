"use client";

import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { ApiError, createProduct, deleteProduct, getProducts, updateProduct } from "@/lib/api";
import type { MediaAsset, ProductColorVariant, ProductMediaItem, ProductRecord } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { AssetPicker } from "@/components/shared/asset-picker";
import { EmptyState } from "@/components/shared/empty-state";
import { LivePreviewPanel } from "@/components/shared/live-preview-panel";
import { Panel } from "@/components/shared/panel";
import { StatusBadge } from "@/components/shared/status-badge";
import { useLivePreview } from "@/lib/use-live-preview";

const createMediaItem = (sortOrder: number): ProductMediaItem => ({
  label: "",
  role: "gallery",
  sort_order: sortOrder,
  publish_state: "draft",
  visibility_state: "visible",
  asset: null,
});

const createColorVariant = (sortOrder: number): ProductColorVariant => ({
  name: "",
  hex_color: "#D2A85E",
  sort_order: sortOrder,
  publish_state: "draft",
  visibility_state: "visible",
  preview_asset: null,
});

const emptyProduct: ProductRecord = {
  title: "",
  subtitle: "",
  slug: "",
  sku: "",
  short_description: "",
  description: "",
  price: "0.00",
  currency: "UZS",
  badge: "",
  publish_state: "draft",
  visibility_state: "visible",
  sort_order: 0,
  is_featured: false,
  is_available: true,
  saved_enabled: true,
  cart_enabled: true,
  order_enabled: true,
  cover_asset: null,
  theme: {
    accent_color: "#D2A85E",
    surface_color: "#111A2D",
    text_color: "#F4F0E8",
    badge_label: "",
    muted_color: "#9BA3B5",
    card_color: "#172236",
    tone: "dark",
    media_panel_mode: "force_black",
    media_panel_color: "",
  },
  media_items: [createMediaItem(0)],
  color_variants: [createColorVariant(0)],
};

export function ProductWorkspace() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductRecord>(emptyProduct);
  const [search, setSearch] = useState("");
  const [publishFilter, setPublishFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const livePreview = useLivePreview(
    "products",
    {
      id: form.id,
      title: form.title,
      subtitle: form.subtitle,
      slug: form.slug,
      description: form.description,
      short_description: form.short_description,
      price: form.price,
      currency: form.currency,
      badge: form.badge,
      publish_state: form.publish_state,
      visibility_state: form.visibility_state,
      sort_order: form.sort_order,
      saved_enabled: form.saved_enabled,
      cart_enabled: form.cart_enabled,
      order_enabled: form.order_enabled,
      cover_asset_id: form.cover_asset?.id ?? null,
      theme: form.theme,
      media_items: form.media_items.map((item) => ({
        ...item,
        asset_id: item.asset?.id ?? null,
      })),
      color_variants: form.color_variants.map((item) => ({
        ...item,
        preview_asset_id: item.preview_asset?.id ?? null,
      })),
    },
    Boolean(form.title)
  );

  const loadProducts = async () => {
    setLoading(true);
    try {
      const payload = await getProducts(search, publishFilter);
      setProducts(payload);
      if (selectedId) {
        const selected = payload.find((item) => item.id === selectedId);
        if (selected) {
          setForm({
            ...selected,
            media_items: selected.media_items.length ? selected.media_items : [createMediaItem(0)],
            color_variants: selected.color_variants.length ? selected.color_variants : [createColorVariant(0)],
          });
          return;
        }
      }
      setSelectedId(payload[0]?.id ?? null);
      setForm(
        payload[0]
          ? {
              ...payload[0],
              media_items: payload[0].media_items.length ? payload[0].media_items : [createMediaItem(0)],
              color_variants: payload[0].color_variants.length ? payload[0].color_variants : [createColorVariant(0)],
            }
          : emptyProduct
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts();
  }, [publishFilter]);

  const selectProduct = (product: ProductRecord) => {
    setSelectedId(product.id ?? null);
    setForm({
      ...product,
      media_items: product.media_items.length ? product.media_items : [createMediaItem(0)],
      color_variants: product.color_variants.length ? product.color_variants : [createColorVariant(0)],
    });
    setError("");
    setSuccess("");
  };

  const updateField = <K extends keyof ProductRecord>(key: K, value: ProductRecord[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateTheme = <K extends keyof ProductRecord["theme"]>(key: K, value: ProductRecord["theme"][K]) => {
    setForm((current) => ({ ...current, theme: { ...current.theme, [key]: value } }));
  };

  const updateMediaItem = <K extends keyof ProductMediaItem>(index: number, key: K, value: ProductMediaItem[K]) => {
    setForm((current) => ({
      ...current,
      media_items: current.media_items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    }));
  };

  const updateColorVariant = <K extends keyof ProductColorVariant>(index: number, key: K, value: ProductColorVariant[K]) => {
    setForm((current) => ({
      ...current,
      color_variants: current.color_variants.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    }));
  };

  const handleCoverAssetChange = (asset: MediaAsset | null) => {
    setForm((current) => ({
      ...current,
      cover_asset: asset,
      cover_asset_id: asset?.id ?? null,
    }));
  };

  const handleMediaAssetChange = (index: number, asset: MediaAsset | null) => {
    setForm((current) => ({
      ...current,
      media_items: current.media_items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, asset, asset_id: asset?.id ?? null } : item
      ),
    }));
  };

  const handleColorAssetChange = (index: number, asset: MediaAsset | null) => {
    setForm((current) => ({
      ...current,
      color_variants: current.color_variants.map((item, itemIndex) =>
        itemIndex === index ? { ...item, preview_asset: asset, preview_asset_id: asset?.id ?? null } : item
      ),
    }));
  };

  const handleCreate = () => {
    setSelectedId(null);
    setForm(emptyProduct);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        title: form.title,
        subtitle: form.subtitle,
        slug: form.slug,
        sku: form.sku,
        short_description: form.short_description,
        description: form.description,
        price: form.price,
        currency: form.currency,
        badge: form.badge,
        publish_state: form.publish_state,
        visibility_state: form.visibility_state,
        sort_order: form.sort_order,
        is_featured: form.is_featured,
        is_available: form.is_available,
        saved_enabled: form.saved_enabled,
        cart_enabled: form.cart_enabled,
        order_enabled: form.order_enabled,
        cover_asset_id: form.cover_asset?.id ?? null,
        theme: form.theme,
        media_items: form.media_items
          .filter((item) => item.asset || item.label)
          .map((item, index) => ({
            ...item,
            sort_order: index,
            asset_id: item.asset?.id ?? null,
          })),
        color_variants: form.color_variants
          .filter((item) => item.name || item.preview_asset)
          .map((item, index) => ({
            ...item,
            sort_order: index,
            preview_asset_id: item.preview_asset?.id ?? null,
          })),
      };
      const saved = selectedId ? await updateProduct(selectedId, payload) : await createProduct(payload);
      await loadProducts();
      setSelectedId(saved.id ?? null);
      setForm(saved);
      setSuccess(`Product ${selectedId ? "updated" : "created"} successfully.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) {
      return;
    }

    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(selectedId);
      await loadProducts();
      setSuccess("Product deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete product.");
    }
  };

  return (
    <div className="workspace-grid product-layout">
      <Panel
        title="Product catalog"
        subtitle="Real catalog records from the Django backend with normalized theme, media, and color data."
        actions={
          <button type="button" className="primary-button" onClick={handleCreate}>
            <Plus size={16} />
            New product
          </button>
        }
      >
        <div className="toolbar">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products..." />
          <select value={publishFilter} onChange={(event) => setPublishFilter(event.target.value)}>
            <option value="">All states</option>
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <button type="button" className="secondary-button" onClick={() => void loadProducts()}>
            Apply
          </button>
        </div>

        {loading ? <p className="muted-text">Loading products...</p> : null}
        {!loading && products.length === 0 ? <EmptyState title="No products yet" message="Create the first product to activate the normalized catalog." /> : null}
        <div className="product-list">
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              className={`product-list-item ${selectedId === product.id ? "is-selected" : ""}`}
              onClick={() => selectProduct(product)}
            >
              <div className="product-list-copy">
                <strong>{product.title}</strong>
                <span>{formatCurrency(product.price, product.currency)}</span>
              </div>
              <div className="inline-actions">
                <StatusBadge state={product.publish_state} />
                {product.badge ? <span className="mini-pill">{product.badge}</span> : null}
              </div>
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Product editor" subtitle="Core content stays separate from display theme, media variants, and action availability flags.">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="full-span">
            Title
            <input value={form.title} onChange={(event) => updateField("title", event.target.value)} required />
          </label>
          <label className="full-span">
            Subtitle
            <input value={form.subtitle} onChange={(event) => updateField("subtitle", event.target.value)} />
          </label>
          <label>
            Slug
            <input value={form.slug} onChange={(event) => updateField("slug", event.target.value)} placeholder="Auto-generated if blank" />
          </label>
          <label>
            SKU
            <input value={form.sku} onChange={(event) => updateField("sku", event.target.value)} />
          </label>
          <label>
            Price
            <input value={form.price} onChange={(event) => updateField("price", event.target.value)} required />
          </label>
          <label>
            Currency
            <input value={form.currency} onChange={(event) => updateField("currency", event.target.value)} maxLength={3} />
          </label>
          <label>
            Badge
            <input value={form.badge} onChange={(event) => updateField("badge", event.target.value)} />
          </label>
          <label>
            Sort order
            <input type="number" value={form.sort_order} onChange={(event) => updateField("sort_order", Number(event.target.value))} />
          </label>
          <label>
            Publish state
            <select value={form.publish_state} onChange={(event) => updateField("publish_state", event.target.value as ProductRecord["publish_state"])}>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label>
            Visibility
            <select value={form.visibility_state} onChange={(event) => updateField("visibility_state", event.target.value as ProductRecord["visibility_state"])}>
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </select>
          </label>
          <label className="full-span">
            Short description
            <input value={form.short_description} onChange={(event) => updateField("short_description", event.target.value)} />
          </label>
          <label className="full-span">
            Description
            <textarea rows={5} value={form.description} onChange={(event) => updateField("description", event.target.value)} />
          </label>

          <div className="full-span">
            <AssetPicker label="Cover asset" selectedAsset={form.cover_asset} onSelect={handleCoverAssetChange} allowedKinds={["image"]} />
          </div>

          <div className="full-span nested-section">
            <div className="section-header-row">
              <div>
                <h3>Display theme</h3>
                <p>Display styling lives separately from core product content so desktop and mobile public UI can render differently later.</p>
              </div>
            </div>
            <div className="subgrid three-up">
              <label>
                Accent color
                <input value={form.theme.accent_color} onChange={(event) => updateTheme("accent_color", event.target.value)} />
              </label>
              <label>
                Surface color
                <input value={form.theme.surface_color} onChange={(event) => updateTheme("surface_color", event.target.value)} />
              </label>
              <label>
                Text color
                <input value={form.theme.text_color} onChange={(event) => updateTheme("text_color", event.target.value)} />
              </label>
              <label>
                Muted color
                <input value={form.theme.muted_color} onChange={(event) => updateTheme("muted_color", event.target.value)} />
              </label>
              <label>
                Card color
                <input value={form.theme.card_color} onChange={(event) => updateTheme("card_color", event.target.value)} />
              </label>
              <label>
                Tone
                <select value={form.theme.tone} onChange={(event) => updateTheme("tone", event.target.value as ProductRecord["theme"]["tone"])}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </label>
              <label>
                Media panel mode
                <select
                  value={form.theme.media_panel_mode}
                  onChange={(event) => updateTheme("media_panel_mode", event.target.value as ProductRecord["theme"]["media_panel_mode"])}
                >
                  <option value="image_tone">Image tone</option>
                  <option value="force_black">Force black</option>
                  <option value="force_white">Force white</option>
                </select>
              </label>
              <label>
                Media panel color
                <input value={form.theme.media_panel_color} onChange={(event) => updateTheme("media_panel_color", event.target.value)} />
              </label>
              <label>
                Badge label override
                <input value={form.theme.badge_label} onChange={(event) => updateTheme("badge_label", event.target.value)} />
              </label>
            </div>
          </div>

          <div className="full-span nested-section">
            <div className="section-header-row">
              <div>
                <h3>Product media</h3>
                <p>Gallery and detail media items remain normalized and orderable.</p>
              </div>
              <button type="button" className="secondary-button" onClick={() => setForm((current) => ({ ...current, media_items: [...current.media_items, createMediaItem(current.media_items.length)] }))}>
                <Plus size={16} />
                Add media
              </button>
            </div>
            <div className="stack-list">
              {form.media_items.map((item, index) => (
                <div key={item.id ?? `media-item-${index}`} className="stack-card">
                  <div className="stack-card-toolbar">
                    <strong>Media item {index + 1}</strong>
                    <button
                      type="button"
                      className="ghost-button danger-text"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          media_items: current.media_items.filter((_, itemIndex) => itemIndex !== index).map((row, itemIndex) => ({ ...row, sort_order: itemIndex })),
                        }))
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="subgrid three-up">
                    <label>
                      Label
                      <input value={item.label} onChange={(event) => updateMediaItem(index, "label", event.target.value)} />
                    </label>
                    <label>
                      Role
                      <select value={item.role} onChange={(event) => updateMediaItem(index, "role", event.target.value as ProductMediaItem["role"])}>
                        <option value="primary">Primary</option>
                        <option value="gallery">Gallery</option>
                        <option value="detail">Detail</option>
                      </select>
                    </label>
                    <label>
                      Publish state
                      <select value={item.publish_state} onChange={(event) => updateMediaItem(index, "publish_state", event.target.value as ProductMediaItem["publish_state"])}>
                        <option value="draft">Draft</option>
                        <option value="review">Review</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </label>
                  </div>
                  <label>
                    Visibility
                    <select value={item.visibility_state} onChange={(event) => updateMediaItem(index, "visibility_state", event.target.value as ProductMediaItem["visibility_state"])}>
                      <option value="visible">Visible</option>
                      <option value="hidden">Hidden</option>
                    </select>
                  </label>
                  <AssetPicker label="Media asset" selectedAsset={item.asset} onSelect={(asset) => handleMediaAssetChange(index, asset)} allowedKinds={["image", "video"]} />
                </div>
              ))}
            </div>
          </div>

          <div className="full-span nested-section">
            <div className="section-header-row">
              <div>
                <h3>Color variants</h3>
                <p>Color variants are normalized for future saved/cart/orders and flexible public rendering.</p>
              </div>
              <button type="button" className="secondary-button" onClick={() => setForm((current) => ({ ...current, color_variants: [...current.color_variants, createColorVariant(current.color_variants.length)] }))}>
                <Plus size={16} />
                Add color
              </button>
            </div>
            <div className="stack-list">
              {form.color_variants.map((item, index) => (
                <div key={item.id ?? `color-item-${index}`} className="stack-card">
                  <div className="stack-card-toolbar">
                    <strong>Color variant {index + 1}</strong>
                    <button
                      type="button"
                      className="ghost-button danger-text"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          color_variants: current.color_variants.filter((_, itemIndex) => itemIndex !== index).map((row, itemIndex) => ({ ...row, sort_order: itemIndex })),
                        }))
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="subgrid three-up">
                    <label>
                      Name
                      <input value={item.name} onChange={(event) => updateColorVariant(index, "name", event.target.value)} />
                    </label>
                    <label>
                      Hex color
                      <input value={item.hex_color} onChange={(event) => updateColorVariant(index, "hex_color", event.target.value)} />
                    </label>
                    <label>
                      Publish state
                      <select value={item.publish_state} onChange={(event) => updateColorVariant(index, "publish_state", event.target.value as ProductColorVariant["publish_state"])}>
                        <option value="draft">Draft</option>
                        <option value="review">Review</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </label>
                  </div>
                  <label>
                    Visibility
                    <select value={item.visibility_state} onChange={(event) => updateColorVariant(index, "visibility_state", event.target.value as ProductColorVariant["visibility_state"])}>
                      <option value="visible">Visible</option>
                      <option value="hidden">Hidden</option>
                    </select>
                  </label>
                  <AssetPicker
                    label="Variant preview asset"
                    selectedAsset={item.preview_asset}
                    onSelect={(asset) => handleColorAssetChange(index, asset)}
                    allowedKinds={["image"]}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="full-span subgrid three-up">
            <label className="toggle-field">
              <input checked={form.is_featured} type="checkbox" onChange={(event) => updateField("is_featured", event.target.checked)} />
              Featured
            </label>
            <label className="toggle-field">
              <input checked={form.is_available} type="checkbox" onChange={(event) => updateField("is_available", event.target.checked)} />
              Available publicly
            </label>
            <label className="toggle-field">
              <input checked={form.saved_enabled} type="checkbox" onChange={(event) => updateField("saved_enabled", event.target.checked)} />
              Saved enabled
            </label>
            <label className="toggle-field">
              <input checked={form.cart_enabled} type="checkbox" onChange={(event) => updateField("cart_enabled", event.target.checked)} />
              Cart enabled
            </label>
            <label className="toggle-field">
              <input checked={form.order_enabled} type="checkbox" onChange={(event) => updateField("order_enabled", event.target.checked)} />
              Order enabled
            </label>
          </div>

          <div className="product-preview full-span" style={{ background: form.theme.surface_color, color: form.theme.text_color }}>
            {form.badge || form.theme.badge_label ? (
              <span className="mini-pill" style={{ background: form.theme.accent_color }}>
                {form.badge || form.theme.badge_label}
              </span>
            ) : null}
            <h3>{form.title || "Product preview"}</h3>
            {form.subtitle ? <p>{form.subtitle}</p> : null}
            <p>{form.short_description || "Short product summary appears here."}</p>
            <strong>{formatCurrency(form.price, form.currency)}</strong>
            <div className="color-chip-row">
              {form.color_variants
                .filter((item) => item.name)
                .map((item, index) => (
                  <span key={`${item.name}-${index}`} className="color-chip" style={{ background: item.hex_color }} title={item.name} />
                ))}
            </div>
          </div>

          {error ? <p className="form-error full-span">{error}</p> : null}
          {success ? <p className="form-success full-span">{success}</p> : null}

          <div className="full-span form-actions">
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? "Saving..." : selectedId ? "Save changes" : "Create product"}
            </button>
            {selectedId ? (
              <button type="button" className="danger-button" onClick={handleDelete}>
                <Trash2 size={16} />
                Delete
              </button>
            ) : null}
          </div>
        </form>
      </Panel>

      <div className="full-span">
        <LivePreviewPanel
          title="Public website preview"
          subtitle="Preview the current product draft inside the full public site snapshot before saving."
          previewUrl={livePreview.previewUrl}
          snapshotUrl={livePreview.snapshotUrl}
          loading={livePreview.loading}
          error={livePreview.error}
        />
      </div>
    </div>
  );
}
