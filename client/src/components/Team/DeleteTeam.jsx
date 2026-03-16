import { deleteTeam } from "../../services/teamServices";
import { Modal, ModalBackground, ModalFooter, ModalHeader } from "../ui/ui-modal";
import { toast } from "react-toastify"

export default function DeleteTeam({ teamId, onClose = () => { }, runAfter = () => { } }) {

    const handleSubmit = async () => {
        try {
            const { success, message } = await deleteTeam(teamId);
            if (success) {
                runAfter();
                onClose();
                return toast.success(message);
            }
            toast.error(message);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <ModalBackground>
            <Modal>
                <div className="flex flex-col gap-4">
                    <ModalHeader
                        title="Delete Team"
                        onClose={onClose}
                    />

                    <p className="text-gray-500">Are you sure you want to delete?</p>

                    <ModalFooter
                        submitLabel='Delete Team'
                        onSubmit={handleSubmit}
                        onClose={onClose}
                    />
                </div>
            </Modal>
        </ModalBackground>
    )
}