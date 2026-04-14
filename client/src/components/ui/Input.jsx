export default function Input({
    label,
    type = "text",
    required = false,
    disabled = false,
    name,
    value = '',
    placeholder,
    onChange = () => { },
    onKeyDown = () => { },
    rightElement = null
}
) {
    return (
        <div>
            {label && <p className="input-label mb-2">{label} {required && <span className="text-nissan-red">*</span>}</p>}
            <div className="relative">
                <input
                    type={type}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`${type === 'file' ? 'file-input' : 'input'} w-full ${rightElement ? 'pr-12' : ''}`}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                />
                {rightElement && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {rightElement}
                    </div>
                )}
            </div>
        </div>
    );
}
