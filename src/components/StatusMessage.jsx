export default function StatusMessage({
  children,
  className = "",
  role,
  ...props
}) {
  // Error jadi alert, pesan biasa jadi status.
  const messageRole =
    role || (className.includes("color-danger") ? "alert" : "status");
  return (
    <span className={`note ${className}`.trim()} role={messageRole} {...props}>
      {children}
    </span>
  );
}
