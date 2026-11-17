export default function Tag({ children, className = "", ...props }) {
  // Tag buat nampilin kategori atau label singkat.
  return (
    <span className={`chip ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}
