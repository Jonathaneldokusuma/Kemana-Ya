export default function Button({
  children,
  className = "",
  type = "button",
  ...props
}) {
  // Semua tombol lewat sini biar gayanya konsisten.
  return (
    <button type={type} className={`button ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
