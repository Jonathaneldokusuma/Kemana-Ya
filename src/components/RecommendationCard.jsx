export default function RecommendationCard({ spot, score, onOpen }) {
  // Kartu ini nampilin spot yang paling direkomendasiin.
  return (
    <button className="front-card" type="button" onClick={() => onOpen(spot)}>
      <img src={spot.image} alt={spot.name} />
      <div>
        <div className="front-title">
          <h2>{spot.name}</h2>
          <span>{score}</span>
        </div>
        <p>{spot.location}</p>
        <small>Masuk Recomend</small>
      </div>
    </button>
  );
}
