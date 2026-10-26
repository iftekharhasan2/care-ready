export default function PageHeader({ eyebrow, title, lead, children }) {
  return (
    <header className="page-head">
      <div className="page-head__text">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {lead && <p className="page-head__lead">{lead}</p>}
      </div>
      {children && <div className="page-head__actions">{children}</div>}
    </header>
  );
}
