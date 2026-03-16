/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useForm } from "../../hooks/form";
import Select from "../ui/Select";
import TagInput from "../ui/TagInput";
import { Modal, ModalBackground, ModalFooter, ModalHeader } from "../ui/ui-modal";
import { toast } from "react-toastify"
import { selectReadAllVariant, updateVariant } from "../../services/variantServices";
import Input from "../ui/Input";

export default function UpdateVariant({ onClose = () => { }, runAfter = () => { } }) {

    const [variants, setVariants] = useState([]);

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