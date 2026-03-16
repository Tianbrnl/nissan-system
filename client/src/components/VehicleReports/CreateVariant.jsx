import { useForm } from "../../hooks/form";
import { createVariant } from "../../services/variantServices";
import Input from "../ui/Input";
import TagInput from "../ui/TagInput";
import { Modal, ModalBackground, ModalFooter, ModalHeader } from "../ui/ui-modal";
import { toast } from "react-toastify"

export default function CreateVariant({ onClose = () => { } }) {

    const { formData, setFormData, handleInputChange } = useForm({
        variant: '',
        units: [],
    });

    const handleSubmit = async () => {
        try {
            const { success, message } = await createVariant(formData);
            if (success) {
                onClose();
                return toast.success(message);
            }
            toast.error(message);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <ModalBackground>
            <Modal maxWidth={600}>
                <div className="flex flex-col gap-4">
                    <ModalHeader
                        title="Add Variant"
                        subTitle="Vehicle Sales by Variant"
                        onClose={onClose}
                    />

                    <Input
                        label="Variant"
                        required={true}
                        name="variant"
                        value={formData?.variant}
                        onChange={handleInputChange}
                    />

                    <TagInput
                        label="Units"
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

                    <ModalFooter
                        submitLabel='Add Variant'
                        onSubmit={handleSubmit}
                        onClose={onClose}
                    />
                </div>
            </Modal>
        </ModalBackground >
    );
}