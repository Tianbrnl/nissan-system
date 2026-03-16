/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useForm } from "../../hooks/form";
import Input from "../ui/Input";
import { Modal, ModalBackground, ModalFooter, ModalHeader } from "../ui/ui-modal";
import { toast } from "react-toastify"
import { useState } from "react";
import { readOneUnit, updateUnit } from "../../services/variantServices";

export default function UpdateUnit({ unitId, onClose = () => { } }) {

    const [errorMessage, setErrorMessage] = useState('');

    const { formData, setFormData, handleInputChange } = useForm({
        name: '',
    });

    const handleSubmit = async () => {
        try {
            const { success, message } = await updateUnit(unitId, formData);
            if (success) {
                onClose();
                return toast.success(message);
            }
            toast.error(message);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        try {
            const load = async () => {
                const {
                    success,
                    message,
                    unit
                } = await readOneUnit(unitId);

                if (success) {
                    return setFormData({name: unit.name});
                };
                setErrorMessage(message);
            }
            load();
        } catch (error) {
            console.error(error);
        }
    }, [unitId]);

    if (errorMessage) {
        return (
            <ModalBackground>
                <Modal>
                    <div className="flex flex-col gap-4">
                        <ModalHeader
                            title="Edit Model"
                            onClose={onClose}
                        />
                        <p className="bg-nissan-red/25 text-nissan-red text-center font-semibold p-4 rounded-xl">{errorMessage}</p>
                    </div>
                </Modal>
            </ModalBackground>
        )
    }

    return (
        <ModalBackground>
            <Modal maxWidth={600}>
                <div className="flex flex-col gap-4">
                    <ModalHeader
                        title="Update Unit"
                        subTitle="Vehicle Sales by Unit"
                        onClose={onClose}
                    />

                    <Input
                        label="Unit"
                        required={true}
                        name="name"
                        value={formData?.name}
                        onChange={handleInputChange}
                    />

                    <ModalFooter
                        submitLabel='Update Unit'
                        onSubmit={handleSubmit}
                        onClose={onClose}
                    />
                </div>
            </Modal>
        </ModalBackground >
    );
}