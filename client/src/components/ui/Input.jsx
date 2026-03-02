export default function Input({
    label,
    type = "text",
    required = false,
    disabled = false,
    name,
    value = '',
    placeholder,
    onChange = () => { } }
) {
    return (
        <div>
            {label && <p className="input-label mb-2">{label} {required && <span className="text-nissan-red">*</span>}</p>}
            <input
                type={type}
                name={name}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                className={`${type === 'file' ? 'file-input' : 'input'} w-full`}
                onChange={onChange}
            />
        </div>
    );
}