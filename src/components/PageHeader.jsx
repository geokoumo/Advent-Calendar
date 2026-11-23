export default function PageHeader({ eyebrow, title, children, aside }) {
  return (
    <header className="page-header reveal">
      <div className="page-header__text">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="page-header__title">{title}</h1>
        {children && <p className="page-header__sub">{children}</p>}
      </div>
      {aside}
    </header>
  );
}
