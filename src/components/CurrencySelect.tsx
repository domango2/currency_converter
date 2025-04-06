interface CurrencySelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  colClass?: string;
  labelWidth?: string;
}

export default function CurrencySelect({
  label,
  value,
  onChange,
  options,
  colClass = "col-sm-3",
  labelWidth = "col-sm-1",
}: CurrencySelectProps) {
  return (
    <>
      <label className={`col-form-label fw-semibold ${labelWidth}`}>
        {label}
      </label>
      <div className={colClass}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="form-select"
        >
          {options.map((curr) => (
            <option key={curr} value={curr}>
              {curr}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
