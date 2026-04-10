/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useForm } from "../../hooks/form";
import Select from "../ui/Select";
import TagInput from "../ui/TagInput";
import { Modal, ModalBackground, ModalFooter, ModalHeader } from "../ui/ui-modal";
import { toast } from "react-toastify"
import { Trash2 } from "lucide-react";
import { deleteUnit, selectReadAllVariant, selectReadUnitVariant, updateVariant } from "../../services/variantServices";
import Input from "../ui/Input";

export default function UpdateVariant({ initialVariantId = '', onClose = () => { }, runAfter = () => { } }) {

    const [variants, setVariants] = useState([]);
    const [existingUnits, setExistingUnits] = useState([]);
    const [isDeletingUnitId, setIsDeletingUnitId] = useState(null);

    const { formData, setFormData, handleInputChange } = useForm({
        variantId: '',
        name: '',
        units: []
    });

    const handleSubmit = async () => {
        try {
            const { success, message } = await updateVariant(formData.variantId, { name: formData.name, units: formData.units });
            if (success) {
                runAfter();
                onClose();
                return toast.success(message);
            }
            toast.error(message);
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteUnit = async (unitId, unitName) => {
        const confirmed = window.confirm(`Delete unit "${unitName}"?`);
        if (!confirmed) return;

        try {
            setIsDeletingUnitId(unitId);
            const { success, message } = await deleteUnit(unitId);

            if (success) {
                setExistingUnits(prev => prev.filter(unit => unit.value !== unitId));
                runAfter();
                return toast.success(message);
            }

            toast.error(message);
        } catch (error) {
            console.log(error);
        } finally {
            setIsDeletingUnitId(null);
        }
    };

    useEffect(() => {
        if (initialVariantId === '' || initialVariantId === null || initialVariantId === undefined) return;

        setFormData(prev => ({
            ...prev,
            variantId: String(initialVariantId)
        }));
    }, [initialVariantId]);

    useEffect(() => {
        try {
            const loadVariant = async () => {
                const { success, message, variants } = await selectReadAllVariant();
                if (success) return setVariants(variants);
                console.error(message);
            }
            loadVariant();
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {

        const variant = variants.find(
            v => v.value === Number(formData.variantId)
        )?.name;

        setFormData(prev => ({
            ...prev,
            name: variant || ""
        }));
    }, [formData.variantId, variants]);

    useEffect(() => {
        try {
            const loadUnits = async () => {
                if (!formData.variantId) {
                    setExistingUnits([]);
                    return;
                }

                const { success, message, units } = await selectReadUnitVariant(formData.variantId);
                if (success) return setExistingUnits(units);

                setExistingUnits([]);
                console.error(message);
            };

            loadUnits();
        } catch (error) {
            console.log(error);
        }
    }, [formData.variantId]);

    return (
        <ModalBackground>
            <Modal maxWidth={600}>
                <div className="flex flex-col gap-4">
                    <ModalHeader
                        title="Update Variant"
                        subTitle="Vehicle Sales by Variant"
                        onClose={onClose}
                    />

                    <Select
                        label="Variant"
                        required={true}
                        name="variantId"
                        placeholder="Select Variant"
                        options={variants}
                        value={formData?.variantId}
                        onChange={handleInputChange}
                    />
                    {formData?.variantId !== '' && (
                        <>
                            <hr className="border-gray-300" />

                            <Input
                                label="Name"
                                required={true}
                                name="name"
                                placeholder="Enter Variant"
                                value={formData?.name}
                                onChange={handleInputChange}
                            />

                            <div className="space-y-2">
                                <p className="input-label">Existing Units</p>
                                {existingUnits.length > 0 ? (
                                    <div className="max-h-60 overflow-auto space-y-2 pr-1">
                                        {existingUnits.map((unit) => (
                                            <div
                                                key={unit.value}
                                                className="flex items-center justify-between gap-3 rounded-xl border border-gray-300 px-3 py-2"
                                            >
                                                <p className="text-sm break-words">{unit.name}</p>
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50"
                                                    disabled={isDeletingUnitId === unit.value}
                                                    onClick={() => handleDeleteUnit(unit.value, unit.name)}
                                                >
                                                    <Trash2 size={16} />
                                                    Delete
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-nissan-gray border border-dashed border-gray-300 rounded-xl px-3 py-4">
                                        No units found for this variant yet.
                                    </p>
                                )}
                            </div>

                            <TagInput
                                label="New Units"
                                required={true}
                                name="units"
                                value={formData?.units}
                                setValue={(newUnits) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        units: newUnits
                                    }))
                                }
                            />
                        </>
                    )}

                    <ModalFooter
                        submitLabel='Update Variant'
                        onSubmit={handleSubmit}
                        onClose={onClose}
                    />
                </div>
            </Modal>
        </ModalBackground >
    );
}
