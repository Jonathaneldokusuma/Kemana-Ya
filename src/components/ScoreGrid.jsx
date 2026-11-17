export default function ScoreGrid({ spot, worthScore }) {
  // Ringkas skor spot di tiga bagian ini.
  return (
    <div className="score-grid">
      <div>
        <span>Worth</span>
        <strong>{worthScore(spot)}</strong>
      </div>
      <div>
        <span>Foto</span>
        <strong>{spot.photoScore}</strong>
      </div>
      <div>
        <span>Tempat</span>
        <strong>{spot.placeScore}</strong>
      </div>
    </div>
  );
}
