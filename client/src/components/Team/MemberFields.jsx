import { Plus, Trash2 } from "lucide-react";
import Input from "../ui/Input";

export default function MemberFields({
    members = [],
    onAdd = () => { },
    onRemove = () => { },
    onChange = () => { }
}) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-nissan-black">Team NMP's</p>
                    <p className="text-sm text-gray-500">Add the sales members you want to track for this team.</p>
                </div>
                <button
                    type="button"
                    className="btn rounded-xl border border-gray-300 bg-white"
                    onClick={onAdd}
                >
                    <Plus size={16} /> Add NMP's
                </button>
            </div>

            <div className="space-y-3">
                {members.map((member, index) => (
                    <div key={member.id ?? `member-${index}`} className="flex items-end gap-3">
                        <div className="grow">
                            <Input
                                label={`Member ${index + 1}`}
                                placeholder="e.g., Alex Santos"
                                value={member.memberName}
                                onChange={(event) => onChange(index, event.target.value)}
                            />
                        </div>
                        <button
                            type="button"
                            className="btn rounded-xl border border-red-200 bg-red-50 text-red-600"
                            onClick={() => onRemove(index)}
                            disabled={members.length === 1}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
