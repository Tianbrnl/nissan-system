/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useForm } from "../../hooks/form";
import Input from "../ui/Input"
import { Modal, ModalBackground, ModalFooter, ModalHeader } from "../ui/ui-modal"
import { readOneTeam, updateTeam } from "../../services/teamServices";
import { useState } from "react";
import { toast } from "react-toastify"

export default function UpdateTeam({ teamId, onClose = () => { }, runAfter = () => { } }) {

    const [errorMessage, setErrorMessage] = useState('');

    const { formData, setFormData, handleInputChange } = useForm({
        teamCode: '',
        teamLeader: ''
    });

    const handleSubmit = async () => {
        try {
            const { success, message } = await updateTeam(teamId, formData);
            if (success) {
                runAfter();
                onClose();
                return toast.success(message);
            }
            toast.error(message);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        try {
            const load = async () => {
                const { success, message, team } = await readOneTeam(teamId);
                if (success) {
                    return setFormData(team);
                }
                setErrorMessage(message);
            }
            load();
        } catch (error) {
            console.error(error);
        }
    }, [teamId]);

    if (errorMessage) {
        return (
            <ModalBackground>
                <Modal>
                    <div className="flex flex-col gap-4">
                        <ModalHeader
                            title="Edit Team"
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
            <Modal>
                <div className="flex flex-col gap-4">
                    <ModalHeader
                        title="Edit Team"
                        onClose={onClose}
                    />

                    <Input
                        label="Team Code"
                        placeholder="e.g., NSR1, NSR2"
                        name="teamCode"
                        required={true}
                        value={formData?.teamCode}
                        onChange={handleInputChange}
                    />
                    <Input
                        label="Team Leader / GRM Name"
                        placeholder="e.g., Mike, Jhoven"
                        name="teamLeader"
                        required={true}
                        value={formData?.teamLeader}
                        onChange={handleInputChange}
                    />

                    <ModalFooter
                        submitLabel='Save Changes'
                        onClose={onClose}
                        onSubmit={handleSubmit}
                    />
                </div>
            </Modal>
        </ModalBackground>
    )
}