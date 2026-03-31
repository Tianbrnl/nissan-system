import { Modal, ModalBackground, ModalHeader } from "../ui/ui-modal";

const formatMonthLabel = (monthValue) => {
    if (!monthValue) {
        return "No month selected";
    }

    const [year, month] = monthValue.split("-");
    const date = new Date(Number(year), Number(month) - 1, 1);

    if (Number.isNaN(date.getTime())) {
        return monthValue;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
    }).format(date);
};

export default function EditMonthEndCommitmentModal({
    isOpen,
    editMonth,
    groups,
    isSaving,
    getTeamDisplayName,
    onClose,
    onMonthChange,
    onCommitmentChange,
    onSave,
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <ModalBackground>
            <Modal maxWidth={720}>
                <div className="space-y-6">
                    <ModalHeader
                        title="Edit Month-End Commitment"
                        subTitle="Update the target month and commitment values for each group."
                        onClose={onClose}
                    />

                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                            Selected Month
                        </p>
                        <p className="mt-2 text-2xl font-bold text-nissan-red">
                            {formatMonthLabel(editMonth)}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="release-plan-edit-month" className="text-sm font-semibold text-gray-700">
                                Commitment Month
                            </label>
                            <input
                                id="release-plan-edit-month"
                                type="month"
                                value={editMonth}
                                onChange={onMonthChange}
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-nissan-red"
                            />
                            {!editMonth && (
                                <p className="text-sm text-nissan-red">Please select a month to continue.</p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="max-h-[340px] space-y-3 overflow-y-auto pr-1">
                                {groups.map((group) => (
                                    <div
                                        key={group.id}
                                        className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[minmax(0,1fr)_180px] md:items-center"
                                    >
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400">
                                                Group / Team
                                            </p>
                                            <p className="mt-1 text-base font-bold text-gray-900">
                                                {getTeamDisplayName(group.team)}
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor={`commitment-${group.id}`} className="text-sm font-semibold text-gray-700">
                                                Month-End Commitment
                                            </label>
                                            <input
                                                id={`commitment-${group.id}`}
                                                type="number"
                                                min="0"
                                                value={group.monthEndCommitment}
                                                onChange={(event) => onCommitmentChange(group.id, event.target.value)}
                                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-center focus:outline-none focus:ring-2 focus:ring-nissan-red"
                                            />
                                        </div>
                                    </div>
                                ))}

                                {!groups.length && (
                                    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                                        No groups available to edit for the selected view.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            className="btn btn-ghost rounded-xl"
                            onClick={onClose}
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn rounded-xl bg-nissan-red text-white disabled:opacity-60"
                            onClick={onSave}
                            disabled={isSaving || !editMonth}
                        >
                            {isSaving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </Modal>
        </ModalBackground>
    );
}
