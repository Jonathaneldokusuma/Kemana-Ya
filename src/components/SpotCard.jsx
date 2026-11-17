import Button from "./Button";
import Icon from "./Icon";
import ScoreGrid from "./ScoreGrid";
import SpotActions from "./SpotActions";
import { locationOutline, starOutline } from "../icons";

const fallback =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'><rect width='4' height='3' fill='%23dbeafe'/></svg>";

export default function SpotCard({ spot, worthScore, isWorth, onOpen, saved, onSave, isOwner, onDelete, onUpdateLocation, busy }) {
  // Klik kartunya buat buka detail spot.
  const worth = isWorth(spot);
  return (
    <article className="spot-card">
      <button type="button" onClick={() => onOpen(spot)}>
        <div className="spot-photo">
          <img
            src={spot.image}
            alt={spot.name}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = fallback;
            }}
          />
          <span className={worth ? "badge-worth" : ""}>
            {worth ? "Pilihan komunitas" : "Baru dijelajahi"}
          </span>
          <b className="score-bubble">{worthScore(spot)}</b>
          <div>
            <h2>{spot.name}</h2>
            <p>
              <Icon src={locationOutline} /> {spot.location}
            </p>
          </div>
        </div>
      </button>
      <div className="spot-body">
        <p className="spot-category">{spot.category}</p>
        <p className="spot-excerpt">{spot.description}</p>
        <ScoreGrid spot={spot} worthScore={worthScore} />
        <Button
          className="fill-outline expand-block"
          onClick={() => onOpen(spot)}
        >
          <Icon src={starOutline} />
          Detail & rating
        </Button>
        <SpotActions spot={spot} saved={saved} onSave={onSave} isOwner={isOwner} onDelete={onDelete} onUpdateLocation={onUpdateLocation} busy={busy} />
      </div>
    </article>
  );
}
