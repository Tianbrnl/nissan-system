import { Users } from "lucide-react";
import { Modal, ModalBackground, ModalHeader } from "../ui/ui-modal";

const getStatusClasses = (status) => (
    status === "No Release"
        ? "bg-red-100 text-red-600"
        : "bg-green-100 text-green-700"
);

const getMemberStatus = (member) => (
    Number(member?.salesCount || 0) === 0 ? "No Release" : "Active"
);

export default function ViewTeamMembers({ team, onClose = () => { } }) {
    return (
        <ModalBackground>
            <Modal maxWidth={820}>
                <div className="space-y-6">
                    <ModalHeader
                        icon={Users}
                        title={`${team?.teamCode || "Team"} NMP's`}
                        subTitle={`${team?.teamLeader || "Team leader"} | ${team?.membersCount || 0} NMP's`}
                        onClose={onClose}
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="border border-gray-300 rounded-xl p-4 space-y-2">
                            <p className="text-sm text-gray-500">NMP's Count</p>
                            <p className="mt-2 text-3xl font-semibold text-nissan-black">{team?.membersCount || 0}</p>
                        </div>
                        <div className="border border-gray-300 bg-nissan-red text-white rounded-xl p-4 space-y-2">
                            <p className="text-sm ">No Release Count</p>
                            <p className="mt-2 text-3xl font-semibold ">{team?.noSalesCount || 0}</p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-300 overflow-hidden">
                        <div className="table-style">
                            <table>
                                <thead>
                                    <tr>
                                        <td>NMP's NAME</td>
                                        <td>RELEASE COUNT</td>
                                        <td>STATUS</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(team?.members || [])
                                        .slice()
                                        .sort((a, b) => {
                                            const aSales = Number(a?.salesCount || 0);
                                            const bSales = Number(b?.salesCount || 0);

                                            const aNoRelease = aSales === 0;
                                            const bNoRelease = bSales === 0;

                                            //  Push "No Release" to bottom
                                            if (aNoRelease !== bNoRelease) {
                                                return aNoRelease - bNoRelease;
                                            }

                                            // If both are Active → sort by highest salesCount
                                            return bSales - aSales;
                                        })
                                        .map((member) => (
                                            <tr key={member.id}>
                                                {/** Derive status from live count so 0 always renders as No Release in red. */}
                                                <td className="text-left font-medium">{member.memberName}</td>
                                                <td>{member.salesCount}</td>
                                                <td>
                                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(getMemberStatus(member))}`}>
                                                        {getMemberStatus(member)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}

                                    {(!team?.members || team.members.length === 0) && (
                                        <tr>
                                            <td colSpan={3} className="py-8 text-center text-gray-500">
                                                No team members added yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Modal>
        </ModalBackground>
    );
}
