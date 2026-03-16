import { useState } from "react";
import { Plus, X } from "lucide-react";

export default function TagInput({
    label,
    disabled = false,
    required = false,
    value = [],
    setValue = () => { },
    placeholder = ""
}) {
    const [input, setInput] = useState('');

    const handleAdd = () => {
        if (input.trim() !== '' && !value.includes(input.trim())) {
            setValue([...value, input.trim()]);
            setInput('');
        }
    }

    const handleRemove = (item) => {
        setValue(value.filter((v) => v !== item));
    }
    return (
        <div>
            {label && <p className="input-label mb-2">{label} {required && <span className="text-nissan-red">*</span>}</p>}
            <div className="flex bg-gray-100 rounded-xl w-full">
                <input
                    type="text"
                    value={input}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="input grow"
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    className="btn btn-square btn-ghost rounded-lg cursor-pointer"
                    onClick={handleAdd}
                >
                    <Plus size={16} />
                </button>
            </div>
            {value.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {value.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-200 py-1 px-4 rounded-lg">
                            <span className="whitespace-normal break-all text-sm">{item}</span>
                            <button
                                className="cursor-pointer"
                                onClick={() => handleRemove(item)}
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div >
            )}
        </div>
    )
}