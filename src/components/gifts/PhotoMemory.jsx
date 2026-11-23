import PhotoGallery from '../PhotoGallery.jsx';
import { Divider } from '../decor/Decor.jsx';

export default function PhotoMemory({ content }) {
  return (
    <div className="photo-memory">
      {content.intro && <p className="gift-intro reveal">{content.intro}</p>}
      <div className="reveal reveal-2">
        <PhotoGallery photos={content.photos || []} />
      </div>
      {content.story && (
        <>
          <Divider />
          <p className="photo-memory__story reveal reveal-3">{content.story}</p>
        </>
      )}
    </div>
  );
}
