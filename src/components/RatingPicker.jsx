export default function RatingPicker({
  label,
  value,
  onPick,
  disabled = false,
}) {
  // Ratingnya dari 1 sampai 5 aja.
  return (
    <div>
      <p className="rating-label">{label}</p>
      <div className="rating-row">
        {/* Bikin tombol rating dari angka 1 sampai 5. */}
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            disabled={disabled}
            className={`rating-button ${value === score ? "active" : ""}`}
            type="button"
            key={score}
            onClick={() => onPick(score)}
          >
            {score}
          </button>
        ))}
      </div>
    </div>
  );
}
