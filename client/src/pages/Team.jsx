import { Pen, Plus, Trash2 } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import { PageSubTitle, PageTitle } from "../components/ui/ui-labels";
import { useState } from "react";
import { Modal, ModalBackground, ModalFooter, ModalHeader } from "../components/ui/ui-modal";
import Input from "../components/ui/Input";
import { useForm } from "../hooks/form";

export default function Team() {

    const { formData, handleInputChange } = useForm({
        teamCode: '',
        teamLeader: ''
    });

    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const teams = [
        {
            id: 1,
            teamCode: 'NSR1',
            teamLeader: 'Mike',
        },
        {
            id: 2,
            teamCode: 'NSR2',
            teamLeader: 'Jhoven',
        },
        {
            id: 3,
            teamCode: 'NSR3',
            teamLeader: 'Jayr',
        }
    ]

    const handleSubmit = () => {
        console.log(formData);
    }

    const handleEdit = (teamId) => {
        console.log(teamId);
        setShowEdit(true);
    }

    const handleDelete = (teamId) => {
        console.log(teamId);
        setShowDelete(true);
    }

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow p-8 space-y-8 overflow-auto">

                {/* header */}
                <div className="flex justify-between items-center gap-4 flex-wrap">
                    <div>
                        <PageTitle>Team Management</PageTitle>
                        <PageSubTitle>Manage sales teams and leaders</PageSubTitle>
                    </div>

                    <button
                        className="btn bg-nissan-red text-white rounded-xl"
                        onClick={() => setShowAdd(true)}
                    >
                        <Plus size={16} /> Add Team
                    </button>
                </div>

                {/* Team Performance */}
                <div className="rounded-xl border border-gray-300 overflow-hidden">
                    <div className="table-style">
                        <table>
                            <thead>
                                <tr>
                                    <td>TEAM CODE</td>
                                    <td>Team Leader / GRM</td>
                                    <td>Full Name</td>
                                    <td>ACTIONS</td>
                                </tr>
                            </thead>
                            <tbody>
                                {teams?.map(team => (
                                    <tr key={team?.id}>
                                        <td className="flex gap-4 items-center font-semibold">
                                            <div className="flex-center bg-nissan-red text-white rounded-full text-lg h-10 w-10">
                                                {team?.teamLeader[0].toUpperCase()}
                                            </div>
                                            {team?.teamCode ? team?.teamCode : '-'}
                                        </td>
                                        <td>{team?.teamLeader ? team?.teamLeader : '-'}</td>
                                        <td>{`${team?.teamCode} - ${team?.teamLeader}`}</td>
                                        <td>
                                            <div className="flex gap-4 items-center justify-center">
                                                <button
                                                    className="cursor-pointer"
                                                    onClick={() => handleEdit(team?.id)}
                                                >
                                                    <Pen size={16} />
                                                </button>
                                                <button
                                                    className="cursor-pointer"
                                                    onClick={() => handleDelete(team?.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Team */}
            <ModalBackground show={showAdd}>
                <Modal>
                    <div className="flex flex-col gap-4">
                        <ModalHeader
                            title="Add New Team"
                            onClose={() => setShowAdd(false)}
                        />

                        <Input
                            label="Team Code"
                            placeholder="e.g., NSR1, NSR2"
                            name="color"
                            required={true}
                            value={formData?.color}
                            onChange={handleInputChange}
                        />
                        <Input
                            label="Team Leader / GRM Name"
                            placeholder="e.g., Mike, Jhoven"
                            name="csNumber"
                            required={true}
                            value={formData?.csNumber}
                            onChange={handleInputChange}
                        />

                        <ModalFooter
                            submitLabel='Add Team'
                            onClose={() => setShowAdd(false)}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </Modal>
            </ModalBackground>

            {/* Edit Team */}
            <ModalBackground show={showEdit}>
                <Modal>
                    <div className="flex flex-col gap-4">
                        <ModalHeader
                            title="Edit Team"
                            onClose={() => setShowEdit(false)}
                        />

                        <Input
                            label="Team Code"
                            placeholder="e.g., NSR1, NSR2"
                            name="color"
                            required={true}
                            value={formData?.color}
                            onChange={handleInputChange}
                        />
                        <Input
                            label="Team Leader / GRM Name"
                            placeholder="e.g., Mike, Jhoven"
                            name="csNumber"
                            required={true}
                            value={formData?.csNumber}
                            onChange={handleInputChange}
                        />

                        <ModalFooter
                            submitLabel='Save Changes'
                            onClose={() => setShowEdit(false)}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </Modal>
            </ModalBackground>

            {/* Delete Team */}
            <ModalBackground show={showDelete}>
                <Modal>
                    <div className="flex flex-col gap-4">
                        <ModalHeader
                            title="Delete Team"
                            onClose={() => setShowDelete(false)}
                        />

                        <p className="text-gray-500">Are you sure you want to delete? This action cannot be undone and will affect all modules using this team.</p>

                        <ModalFooter
                            submitLabel='Delete Team'
                            onClose={() => setShowDelete(false)}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </Modal>
            </ModalBackground>

        </div >
    )
}