import { FileDown } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import { PageSubTitle, PageTitle } from "../components/ui/ui-labels";
import ApprovalRate from "../components/ApprovalRate";
import AvailmentRate from "../components/AvailmentRate";
import { useEffect } from "react";
import { fetchApplicationsApprovals, fetchTeamPerformance } from "../services/applicationsApprovals";
import { useState } from "react";
import { getCurrentMonthYear } from "../utils/tools";
import Input from "../components/ui/Input";
import { calculateApprovalRate, calculateAvailmentRate, getRateColorClass } from "../utils/calculation";

export default function ApplicationApproval() {

    const APPROVAL_TARGET = 40;
    const AVAILMENT_TARGET = 75;

    const [monthYear, setMonthYear] = useState(getCurrentMonthYear);

    const [applicationsApprovalsData, setApplicationsApprovalsData] = useState([]);
    const [teamPerformanceData, setTeamPerformanceData] = useState([]);

    useEffect(() => {
        const loadApplicationsApprovals = async () => {
            const formattedToYear = monthYear.substring(0, 4);
            const { success, message, applicationsApprovals, totals } = await fetchApplicationsApprovals(formattedToYear);
            console.log({ applicationsApprovals, totals });
            if (success) return setApplicationsApprovalsData({ applicationsApprovals, totals });
            console.error(message);
        }
        const loadTeamPerformance = async () => {
            const { success, message, teamPerformance, totals } = await fetchTeamPerformance(monthYear);
            if (success) return setTeamPerformanceData({ teams: teamPerformance, totals });
            console.error(message);
        }
        loadApplicationsApprovals();
        loadTeamPerformance();
    }, [monthYear]);

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow p-8 space-y-8 overflow-auto">

                {/* header */}
                <div className="flex justify-between items-center gap-4 flex-wrap">
                    <div>
                        <PageTitle>Applications & Approvals</PageTitle>
                        <PageSubTitle>Track and manage financing applications and approval rates</PageSubTitle>
                    </div>
                    <div className="flex gap-4">
                        <button className="btn bg-nissan-red text-white rounded-xl">
                            <FileDown size={16} /> Export
                        </button>
                        <div className="w-50">
                            <Input
                                value={monthYear}
                                type="month"
                                onChange={(e) => setMonthYear(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Applications & Approvals - Overall Monthly Matrix */}
                <div className="rounded-xl border border-gray-300 overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b border-gray-300">
                        <p className="text-lg font-semibold">Applications & Approvals - Overall Monthly Matrix - {monthYear.substring(0, 4)}</p>
                    </div>

                    <div className="table-style">
                        <table>
                            <thead>
                                <tr>
                                    <td className="rowHeader">ACCOUNT TYPE</td>
                                    {applicationsApprovalsData?.applicationsApprovals?.map((data, index) => (
                                        <td key={index}>{data?.month}</td>
                                    ))}
                                    <td className="rowFooter">TOTAL</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="rowHeader">Applied</td>

                                    {applicationsApprovalsData?.applicationsApprovals?.map((data, index) => (
                                        <td key={index} className={data?.applications > 0 ? '' : 'text-nissan-gray'}>{data?.applications}</td>
                                    ))}

                                    <td className="rowFooter">
                                        {applicationsApprovalsData?.applicationsApprovals?.reduce((sum, num) => sum + num?.applications, 0) ?? 0}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="rowHeader">Approved (As Applied)</td>

                                    {applicationsApprovalsData?.applicationsApprovals?.map((data, index) => (
                                        <td key={index} className={data?.appliedApproved > 0 ? '' : 'text-nissan-gray'}>{data?.appliedApproved}</td>
                                    ))}

                                    <td className="rowFooter">
                                        {applicationsApprovalsData?.applicationsApprovals?.reduce((sum, num) => sum + num?.appliedApproved, 0) ?? 0}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="rowHeader">Approved <span className="text-nissan-red">(Not As Applied)</span></td>

                                    {applicationsApprovalsData?.applicationsApprovals?.map((data, index) => (
                                        <td key={index} className={data?.appliedNotApproved > 0 ? '' : 'text-nissan-gray'}>{data?.appliedNotApproved}</td>
                                    ))}

                                    <td className="rowFooter">
                                        {applicationsApprovalsData?.applicationsApprovals?.reduce((sum, num) => sum + num?.appliedNotApproved, 0) ?? 0}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="rowHeader">Availed</td>

                                    {applicationsApprovalsData?.applicationsApprovals?.map((data, index) => (
                                        <td key={index} className={data?.availed > 0 ? '' : 'text-nissan-gray'}>{data?.availed}</td>
                                    ))}

                                    <td className="rowFooter">
                                        {applicationsApprovalsData?.applicationsApprovals?.reduce((sum, num) => sum + num?.availed, 0) ?? 0}
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="rowHeader">TOTAL</td>
                                    {applicationsApprovalsData?.applicationsApprovals?.map((month, index) => (
                                        <td key={index}>{month?.applications + month?.appliedApproved + month?.appliedNotApproved + month?.availed}</td>
                                    ))}
                                    <td className="rowFooter">
                                        {Object.values(applicationsApprovalsData?.totals ?? {}).reduce((sum, num) => sum + num, 0)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Team Performance */}
                <div className="rounded-xl border border-gray-300 overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b border-gray-300">
                        <p className="text-lg font-semibold">Team Performance - {monthYear}</p>
                    </div>

                    <div className="table-style">
                        <table>
                            <thead>
                                <tr>
                                    <td className="rowHeader">TEAM</td>
                                    <td>APPLICATIONS</td>
                                    <td>APPROVED (AS APPLIED)</td>
                                    <td>APPROVED (NOT AS APPLIED)</td>
                                    <td>AVAILED</td>
                                    <td>APPROVAL RATE <span className="text-xs font-normal text-nissan-black">(Target: 40%)</span></td>
                                    <td>AVAILMENT RATE <span className="text-xs font-normal text-nissan-black">(Target: 75%)</span></td>
                                </tr>
                            </thead>
                            <tbody>
                                {teamPerformanceData?.teams?.map(team => (
                                    <tr key={team?.teamId}>
                                        <td className="rowHeader">{team?.team}</td>
                                        <td className={team?.applications > 0 ? '' : 'text-nissan-gray'}>{team?.applications}</td>
                                        <td className={team?.appliedApproved > 0 ? '' : 'text-nissan-gray'}>{team?.appliedApproved}</td>
                                        <td className={team?.appliedNotApproved > 0 ? '' : 'text-nissan-gray'}>{team?.appliedNotApproved}</td>
                                        <td className={team?.availed > 0 ? '' : 'text-nissan-gray'}>{team?.availed}</td>

                                        <td className={`font-bold ${getRateColorClass(calculateApprovalRate(team?.applications, team?.appliedApproved, team?.appliedNotApproved), APPROVAL_TARGET)}`}>
                                            {calculateApprovalRate(team?.applications, team?.appliedApproved, team?.appliedNotApproved)}%
                                        </td>
                                        <td className={`font-bold ${getRateColorClass(calculateAvailmentRate(team?.availed, team?.appliedApproved, team?.appliedNotApproved), AVAILMENT_TARGET)}`}>
                                            {calculateAvailmentRate(team?.availed, team?.appliedApproved, team?.appliedNotApproved)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="rowHeader">TOTAL</td>
                                    <td className={teamPerformanceData?.totals?.applications > 0 ? '' : 'text-nissan-gray'}>{teamPerformanceData?.totals?.applications}</td>
                                    <td className={teamPerformanceData?.totals?.appliedApproved > 0 ? '' : 'text-nissan-gray'}>{teamPerformanceData?.totals?.appliedApproved}</td>
                                    <td className={teamPerformanceData?.totals?.appliedNotApproved > 0 ? '' : 'text-nissan-gray'}>{teamPerformanceData?.totals?.appliedNotApproved}</td>
                                    <td className={teamPerformanceData?.totals?.availed > 0 ? '' : 'text-nissan-gray'}>{teamPerformanceData?.totals?.availed}</td>

                                    <td className={`font-bold ${getRateColorClass(calculateApprovalRate(teamPerformanceData?.totals?.applications, teamPerformanceData?.totals?.appliedApproved, teamPerformanceData?.totals?.appliedNotApproved), APPROVAL_TARGET)}`}>
                                        {calculateApprovalRate(teamPerformanceData?.totals?.applications, teamPerformanceData?.totals?.appliedApproved, teamPerformanceData?.totals?.appliedNotApproved)}%
                                    </td>
                                    <td className={`font-bold ${getRateColorClass(calculateAvailmentRate(teamPerformanceData?.totals?.availed, teamPerformanceData?.totals?.appliedApproved, teamPerformanceData?.totals?.appliedNotApproved), AVAILMENT_TARGET)}`}>
                                        {calculateAvailmentRate(teamPerformanceData?.totals?.availed, teamPerformanceData?.totals?.appliedApproved, teamPerformanceData?.totals?.appliedNotApproved)}%
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <section className="grid lg:grid-cols-2 gap-8">
                    <div className="p-4 space-y-4 rounded-xl border border-gray-300 overflow-hidden">
                        <p className="text-lg font-semibold">Team Comparison - Approval Rate</p>
                        <div className="h-70">
                            <ApprovalRate teams={teamPerformanceData?.teams} />
                        </div>
                    </div>
                    <div className="p-4 space-y-4 rounded-xl border border-gray-300 overflow-hidden">
                        <p className="text-lg font-semibold">Team Comparison - Availment Rate</p>

                        <div className="h-70">
                            <AvailmentRate teams={teamPerformanceData?.teams} />
                        </div>
                    </div>
                </section>
            </div>
        </div >
    )
}
