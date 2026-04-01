import type { PropsWithChildren, ReactNode } from "react";

export function Panel({
  title,
  subtitle,
  actions,
  children,
}: PropsWithChildren<{ title: string; subtitle?: string; actions?: ReactNode }>) {
  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {actions ? <div className="panel-actions">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}
