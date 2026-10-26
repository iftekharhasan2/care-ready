/** Role home banner: greeting, the one thing to do next, and an illustration. */
export default function HeroBanner({ eyebrow, title, lead, image, alt, children }) {
  return (
    <section className="banner">
      <div className="banner__text">
        <p className="banner__eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {lead && <p className="banner__lead">{lead}</p>}
        {children && <div className="banner__actions">{children}</div>}
      </div>
      <img className="banner__img" src={image} alt={alt} />
    </section>
  );
}
