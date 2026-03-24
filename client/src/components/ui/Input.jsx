export default function Input({
    label,
    type = "text",
    required = false,
    disabled = false,
    name,
    value = '',
    placeholder,
    onChange = () => { },
    onKeyDown = () => { }
}
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
                onKeyDown={onKeyDown}
            />
        </div>
    );
}
