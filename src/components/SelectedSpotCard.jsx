import Tag from "./Tag";

export default function SelectedSpotCard({ spot }) {
  // Belum pilih spot? Jangan tampilin kartunya.
  if (!spot) return null;
  return (
    <aside className="selected-card">
      <p className="eyebrow">Selected Spot</p>
      <h2>{spot.name}</h2>
      <p>{spot.location}</p>
      <p>{spot.description}</p>
      <div className="chip-row">
        {spot.tags.map((tag) => (
          <Tag className="color-success" key={tag}>
            {tag}
          </Tag>
        ))}
      </div>
    </aside>
  );
}
