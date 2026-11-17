import Icon from "./Icon";

export default function FormField({ label, icon, children }) {
  // Biar label, ikon, dan input rapi dalam satu komponen.
  return (
    <div className="form-item">
      {icon && <Icon src={icon} />}
      <label className="field-control">
        <span className="field-label">{label}</span>
        {children}
      </label>
    </div>
  );
}
