export default function Select({
    label,
    required = false,
    disabled = false,
    name,
    value = '',
    placeholder,
    options = [],
    onChange = () => { }
}) {
    return (
        <div>
            {label && <p className="input-label mb-2">{label} {required && <span className="text-nissan-red">*</span>}</p>}
            <select
                name={name}
                value={value}
                className="select w-full"
                disabled={disabled}
                onChange={onChange}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((option, index) => (
                    <option key={index} value={option?.value}>{option?.name}</option>
                ))}
            </select>
        </div>
    );
}