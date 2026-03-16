import { Pen, Plus, Trash2 } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import { PageSubTitle, PageTitle } from "../components/ui/ui-labels";
import { useState } from "react";
import CreateTeam from "../components/Team/CreateTeam";
import DeleteTeam from "../components/Team/DeleteTeam";
import { useEffect } from "react";
import { readAllTeam } from "../services/teamServices";
import UpdateTeam from "../components/Team/UpdateTeam";


export default function Team() {

    const [teamId, setTeamId] = useState(1);

    const [showAdd, setShowAdd] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const [data, setData] = useState([]);

    const handleEdit = (teamId) => {
        setTeamId(teamId);
        setShowUpdate(true);
    };

    const handleDelete = (teamId) => {
        setTeamId(teamId);
        setShowDelete(true);
    };

    const loadTable = async () => {
        const { success, message, teams } = await readAllTeam();
        if (success) return setData(teams);
        console.error(message);
    };

    useEffect(() => {
        try {
            queueMicrotask(() => {
                loadTable();
            })
        } catch (error) {
            console.log(error);
        }
    }, []);

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
                                {data?.map(team => (
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

            {/* Create Team */}
            {showAdd && <CreateTeam onClose={() => setShowAdd(false)} runAfter={loadTable} />}

            {/* Update Team */}
            {showUpdate && <UpdateTeam teamId={teamId} onClose={() => setShowUpdate(false)} runAfter={loadTable} />}

            {/* Delete Team */}
            {showDelete && <DeleteTeam teamId={teamId} onClose={() => setShowDelete(false)} runAfter={loadTable} />}

        </div >
    )
}