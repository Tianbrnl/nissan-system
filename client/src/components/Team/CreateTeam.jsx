import { useForm } from "../../hooks/form";
import { createTeam } from "../../services/teamServices";
import Input from "../ui/Input"
import { Modal, ModalBackground, ModalFooter, ModalHeader } from "../ui/ui-modal"
import { toast } from "react-toastify"
import MemberFields from "./MemberFields";

export default function CreateTeam({ onClose = () => { }, runAfter = () => { } }) {

    const { formData, handleInputChange } = useForm({
        teamCode: '',
        teamLeader: '',
        members: [{ memberName: '' }]
    });

    const handleMemberChange = (index, value) => {
        const nextMembers = [...formData.members];
        nextMembers[index] = {
            ...nextMembers[index],
            memberName: value
        };

        handleInputChange({
            target: {
                name: "members",
                value: nextMembers
            }
        });
    };
// add member
    const handleAddMember = () => {
        handleInputChange({
            target: {
                name: "members",
                value: [...formData.members, { memberName: '' }]
            }
        });
    };
// remove member
    const handleRemoveMember = (index) => {
        const nextMembers = formData.members.filter((_, memberIndex) => memberIndex !== index);

        handleInputChange({
            target: {
                name: "members",
                value: nextMembers.length > 0 ? nextMembers : [{ memberName: '' }]
            }
        });
    };

    const handleSubmit = async () => {
        const { success, message } = await createTeam(formData);
        if (success) {
            runAfter();
            onClose();
            return toast.success(message);
        }
        toast.error(message);
    }

    return (
        < ModalBackground>
            <Modal>
                <div className="flex flex-col gap-4">
                    <ModalHeader
                        title="Add New Team"
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

                    <MemberFields
                        members={formData.members}
                        onAdd={handleAddMember}
                        onRemove={handleRemoveMember}
                        onChange={handleMemberChange}
                    />

                    <ModalFooter
                        submitLabel='Add Team'
                        onClose={onClose}
                        onSubmit={handleSubmit}
                    />
                </div>
            </Modal>
        </ModalBackground >
    )
}
