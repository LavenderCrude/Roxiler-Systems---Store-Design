export default function Input({
  label,
  error,
  id,
  type = 'text',
  register,
  ...rest
}) {
  const inputId = id || rest.name;

  return (
    <div className="form-field">
      {label && <label htmlFor={inputId}>{label}</label>}
      <input id={inputId} type={type} className={error ? 'input-error' : ''} {...register} {...rest} />
      {error && <span className="field-error">{error.message}</span>}
    </div>
  );
}
