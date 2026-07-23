export default function Select({ label, error, id, register, options, ...rest }) {
  const selectId = id || rest.name;

  return (
    <div className="form-field">
      {label && <label htmlFor={selectId}>{label}</label>}
      <select id={selectId} className={error ? 'input-error' : ''} {...register} {...rest}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="field-error">{error.message}</span>}
    </div>
  );
}
