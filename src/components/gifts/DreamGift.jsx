import PhotoFrame from '../PhotoFrame.jsx';
import { Divider } from '../decor/Decor.jsx';

export default function DreamGift({ content }) {
  return (
    <article className="dream">
      <p className="eyebrow reveal">{content.eyebrow}</p>
      <h2 className="dream__place reveal reveal-1">{content.place}</h2>
      {content.image && (
        <div className="dream__image reveal reveal-2">
          <PhotoFrame photo={content.image} variant="film" ratio="3 / 2" />
        </div>
      )}
      {content.intro && <p className="dream__intro reveal reveal-3">{content.intro}</p>}
      {content.details?.length > 0 && (
        <ol className="dream__timeline reveal reveal-4">
          {content.details.map((d, i) => (
            <li key={i}>
              <span className="dream__label">{d.label}</span>
              <span className="dream__text">{d.text}</span>
            </li>
          ))}
        </ol>
      )}
      {content.closing && (
        <>
          <Divider />
          <p className="dream__closing reveal reveal-5">{content.closing}</p>
        </>
      )}
    </article>
  );
}
