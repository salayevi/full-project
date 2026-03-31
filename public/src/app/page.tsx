import PublicSiteContentProvider from "./companent/shared/content/PublicSiteContentProvider";
import ResponsivePage from "./companent/shared/responsive/ResponsivePage";
import { publicAppConfig } from "@/lib/backend/config";
import { PublicApiError, getPublicSiteSnapshot } from "@/lib/backend/public-api-source";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function PublicSiteSetupState({
  message,
  previewToken,
}: {
  message: string;
  previewToken?: string;
}) {
  const setupSteps = [
    "Create Site Settings in the dashboard.",
    "Publish the Theme inside Site Settings.",
    "Publish Hero, About, and Footer records.",
    "Reload the public website.",
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "32px",
        background:
          "radial-gradient(circle at top, rgba(209, 62, 162, 0.12), transparent 36%), var(--site-bg-page)",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "760px",
          borderRadius: "28px",
          border: "1px solid var(--site-border-soft)",
          background: "var(--site-surface-white)",
          boxShadow: "var(--shadow-card)",
          padding: "32px",
          color: "var(--site-text-primary)",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "var(--site-brand-primary-strong)",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Public Site Setup Required
        </p>
        <h1
          style={{
            margin: "12px 0 10px",
            fontSize: "clamp(32px, 4vw, 46px)",
            lineHeight: 1.02,
          }}
        >
          Public content is not published yet
        </h1>
        <p
          style={{
            margin: 0,
            color: "var(--site-text-secondary)",
            fontSize: "17px",
            lineHeight: 1.7,
          }}
        >
          {message}
        </p>
        {previewToken ? (
          <p
            style={{
              margin: "14px 0 0",
              color: "var(--site-text-secondary)",
              fontSize: "14px",
            }}
          >
            Preview token was provided, but the required base public content is still missing.
          </p>
        ) : null}

        <div
          style={{
            marginTop: "24px",
            padding: "20px 22px",
            borderRadius: "20px",
            background: "var(--site-bg-soft)",
          }}
        >
          <strong style={{ display: "block", marginBottom: "10px" }}>Next steps</strong>
          <ol
            style={{
              margin: 0,
              paddingLeft: "20px",
              color: "var(--site-text-secondary)",
              lineHeight: 1.9,
            }}
          >
            {setupSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const previewKey = publicAppConfig.previewQueryKey;
  const previewValue = params?.[previewKey];
  const previewToken = Array.isArray(previewValue) ? previewValue[0] : previewValue;

  try {
    const snapshot = await getPublicSiteSnapshot(previewToken);

    return (
      <PublicSiteContentProvider snapshot={snapshot}>
        <ResponsivePage />
      </PublicSiteContentProvider>
    );
  } catch (error) {
    if (error instanceof PublicApiError && error.status === 404) {
      return <PublicSiteSetupState message={error.message} previewToken={previewToken} />;
    }

    throw error;
  }
}
