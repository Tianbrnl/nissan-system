export default function Textarea({
    label,
    disabled = false,
    required = false,
    name,
    value,
    placeholder,
    onChange = () => { }
}) {
    return (
        <div>
            {label && <p className="input-label mb-1">{label} {required && <span className="text-nissan-red">*</span>}</p>}
            <textarea
                name={name}
                placeholder={placeholder}
                disabled={disabled}
                value={value}
                className="textarea w-full resize-none field-sizing-content"
                onChange={onChange}
            />
        </div>
    );
}