import { Eye, Pen, Plus, Trash2, Users } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import { PageSubTitle, PageTitle } from "../components/ui/ui-labels";
import { useState } from "react";
import CreateTeam from "../components/Team/CreateTeam";
import DeleteTeam from "../components/Team/DeleteTeam";
import { useEffect } from "react";
import { readAllTeam } from "../services/teamServices";
import UpdateTeam from "../components/Team/UpdateTeam";
import ViewTeamMembers from "../components/Team/ViewTeamMembers";


export default function Team() {

    const [teamId, setTeamId] = useState(1);

    const [showAdd, setShowAdd] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showMembers, setShowMembers] = useState(false);

    const [data, setData] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);

    const handleEdit = (teamId) => {
        setTeamId(teamId);
        setShowUpdate(true);
    };

    const handleDelete = (teamId) => {
        setTeamId(teamId);
        setShowDelete(true);
    };

    const handleView = (team) => {
        setSelectedTeam(team);
        setShowMembers(true);
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

                <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
                    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Total Teams</p>
                        <p className="mt-2 text-3xl font-semibold text-nissan-black">{data.length}</p>
                    </div>
                    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Total NMPs</p>
                        <p className="mt-2 text-3xl font-semibold text-nissan-black">
                            {data.reduce((total, team) => total + (team.membersCount || 0), 0)}
                        </p>
                    </div>
                    <div className="rounded-3xl border border-red-100 bg-red-50 p-5 shadow-sm">
                        <p className="text-sm text-red-500">NMPs With No Release</p>
                        <p className="mt-2 text-3xl font-semibold text-red-600">
                            {data.reduce((total, team) => total + (team.noSalesCount || 0), 0)}
                        </p>
                    </div>
                </div>

                {/* Team Performance */}
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                    <div className="table-style">
                        <table>
                            <thead>
                                <tr>
                                    <td>TEAM CODE</td>
                                    <td>GRM</td>
                                    <td>NMPs COUNT</td>
                                    <td>NO RELEASE COUNT</td>
                                    <td>ACTIONS</td>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.map(team => (
                                    <tr key={team?.id}>
                                        <td className="flex items-center gap-4 font-semibold">
                                            <div className="flex-center h-11 w-11 rounded-2xl bg-nissan-red text-lg text-white shadow-sm">
                                                {team?.teamLeader[0].toUpperCase()}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-nissan-black">{team?.teamCode ? team?.teamCode : '-'}</p>
                                                <p className="text-xs font-normal text-gray-500">Sales team</p>
                                            </div>
                                        </td>
                                        <td>{team?.teamLeader ? team?.teamLeader : '-'}</td>
                                        <td>
                                            <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                                                <Users size={14} />
                                                {team?.membersCount ?? 0}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${team?.noSalesCount ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                                                {team?.noSalesCount ?? 0}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex gap-4 items-center justify-center">
                                                <button
                                                    className="cursor-pointer"
                                                    onClick={() => handleView(team)}
                                                >
                                                    <Eye size={16} />
                                                </button>
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

            {/* View Members */}
            {showMembers && selectedTeam && (
                <ViewTeamMembers
                    team={selectedTeam}
                    onClose={() => setShowMembers(false)}
                />
            )}

        </div >
    )
}
