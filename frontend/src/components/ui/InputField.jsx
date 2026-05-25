export default function InputField({
  label,
  id,
  icon: Icon,
  className = "",
  ...inputProps
}) {
  const inputId = id || inputProps.name;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className={`input-field ${Icon ? "" : "input-field--plain"}`}>
        {Icon && <Icon className="input-field__icon" aria-hidden />}
        <input id={inputId} {...inputProps} />
      </div>
    </div>
  );
}
