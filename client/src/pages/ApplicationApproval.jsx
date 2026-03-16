import { FileDown } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import { PageSubTitle, PageTitle } from "../components/ui/ui-labels";
import ApprovalRate from "../components/ApprovalRate";
import AvailmentRate from "../components/AvailmentRate";

export default function ApplicationApproval() {

    const totals = {
        applications: 165,
        approved: 138,
        availed: 93,
        rate: 84,
    }

    const dates = [
        { value: '', name: 'DEC 2025' },
        { value: '', name: 'JAN 2026' },
        { value: '', name: 'FEB 2026' },
        { value: '', name: 'MAR 2026' },
        { value: '', name: 'APR 2026' },
        { value: '', name: 'MAY 2026' },
        { value: '', name: 'JUN 2026' },
        { value: '', name: 'JUL 2026' },
        { value: '', name: 'AUG 2026' },
        { value: '', name: 'SEP 2026' },
        { value: '', name: 'OCT 2026' },
        { value: '', name: 'NOV 2026' },
        { value: '', name: 'DEC 2026' }
    ];

    const applicationsApprovals = {
        applied: [60, 55, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        appliedApproved: [40, 38, 35, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        appliedNotApproved: [10, 8, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        availed: [35, 30, 28, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        totals: [60, 55, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
    const teamPerformance = {
        teams: [
            {
                id: 1,
                name: 'NSR1 – Mike',
                applications: 25,
                appliedApproved: 18,
                appliedNotApproved: 4,
                availed: 16,
            },
            {
                id: 2,
                name: 'NSR2 – Jhoven',
                applications: 20,
                appliedApproved: 15,
                appliedNotApproved: 3,
                availed: 13,
            },
            {
                id: 3,
                name: 'NSR3 – Jayr',
                applications: 15,
                appliedApproved: 7,
                appliedNotApproved: 3,
                availed: 6,
            }
        ],
        totals: {
            applications: 60,
            appliedApproved: 40,
            appliedNotApproved: 10,
            availed: 35,
        }
    }

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

                    <button className="btn bg-nissan-red text-white rounded-xl">
                        <FileDown size={16} /> Export
                    </button>
                </div>

                {/* totals */}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">

                    <div className="border border-gray-300 rounded-xl p-4 space-y-2">
                        <p className="text-sm">Total Applications</p>
                        <h2 className="font-bold">{totals?.applications}</h2>
                    </div>
                    <div className="border border-gray-300 rounded-xl p-4 space-y-2">
                        <p className="text-sm">Total Approved</p>
                        <h2 className="font-bold">{totals?.approved}</h2>
                    </div>
                    <div className="border border-gray-300 rounded-xl p-4 space-y-2">
                        <p className="text-sm">Total Availed</p>
                        <h2 className="font-bold">{totals?.availed}</h2>
                    </div>
                    <div className="border border-gray-300 rounded-xl p-4 space-y-2">
                        <p className="text-sm">Total Rate</p>
                        <h2 className="font-bold text-green-600">{totals?.rate}%</h2>
                    </div>
                </div>

                {/* Applications & Approvals - Overall Monthly Matrix */}
                <div className="rounded-xl border border-gray-300 overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b border-gray-300">
                        <p className="text-lg font-semibold">Applications & Approvals - Overall Monthly Matrix</p>
                    </div>

                    <div className="table-style">
                        <table>
                            <thead>
                                <tr>
                                    <td className="rowHeader">ACCOUNT TYPE</td>
                                    {dates?.map((date, index) => (
                                        <td key={index}>{date?.name}</td>
                                    ))}
                                    <td className="rowFooter">TOTAL</td>
                                </tr>
                            </thead>
                            <tbody>

                                <tr>
                                    <td className="rowHeader">Applied</td>

                                    {applicationsApprovals?.applied?.map((data, index) => (
                                        <td key={index} className={data > 0 ? '' : 'text-nissan-gray'}>{data}</td>
                                    ))}

                                    <td className="rowFooter">
                                        {applicationsApprovals?.applied?.reduce((sum, num) => sum + num, 0) ?? 0}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="rowHeader">Approved (As Applied)</td>

                                    {applicationsApprovals?.appliedApproved?.map((data, index) => (
                                        <td key={index} className={data > 0 ? '' : 'text-nissan-gray'}>{data}</td>
                                    ))}

                                    <td className="rowFooter">
                                        {applicationsApprovals?.appliedApproved?.reduce((sum, num) => sum + num, 0) ?? 0}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="rowHeader">Approved <span className="text-nissan-red">(Not As Applied)</span></td>

                                    {applicationsApprovals?.appliedNotApproved?.map((data, index) => (
                                        <td key={index} className={data > 0 ? '' : 'text-nissan-gray'}>{data}</td>
                                    ))}

                                    <td className="rowFooter">
                                        {applicationsApprovals?.appliedNotApproved?.reduce((sum, num) => sum + num, 0) ?? 0}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="rowHeader">Availed</td>

                                    {applicationsApprovals?.availed?.map((data, index) => (
                                        <td key={index} className={data > 0 ? '' : 'text-nissan-gray'}>{data}</td>
                                    ))}

                                    <td className="rowFooter">
                                        {applicationsApprovals?.availed?.reduce((sum, num) => sum + num, 0) ?? 0}
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="rowHeader">TOTAL</td>
                                    {applicationsApprovals?.totals?.map((total, index) => (
                                        <td key={index}>{total}</td>
                                    ))}
                                    <td className="rowFooter">
                                        {applicationsApprovals?.totals?.reduce((sum, num) => sum + num, 0) ?? 0}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Team Performance */}
                <div className="rounded-xl border border-gray-300 overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b border-gray-300">
                        <p className="text-lg font-semibold">Team Performance - Dec 2025</p>
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
                                    <td>APPROVAL RATE</td>
                                    <td>AVAILMENT RATE</td>
                                </tr>
                            </thead>
                            <tbody>
                                {teamPerformance?.teams?.map((team, index) => (
                                    <tr key={index}>
                                        <td className="rowHeader">{team?.name}</td>
                                        <td className={team?.applications > 0 ? '' : 'text-nissan-gray'}>{team?.applications}</td>
                                        <td className={team?.appliedApproved > 0 ? '' : 'text-nissan-gray'}>{team?.appliedApproved}</td>
                                        <td className={team?.appliedNotApproved > 0 ? '' : 'text-nissan-gray'}>{team?.appliedNotApproved}</td>
                                        <td className={team?.availed > 0 ? '' : 'text-nissan-gray'}>{team?.availed}</td>

                                        <td className="font-bold text-green-600">{Math.round(((team?.appliedApproved + team?.appliedNotApproved) / team?.applications) * 100)}%</td>
                                        <td className="font-bold text-green-600">{Math.round((team?.availed / team?.appliedApproved) * 100)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="rowHeader">TOTAL</td>
                                    <td className={teamPerformance?.totals?.applications > 0 ? '' : 'text-nissan-gray'}>{teamPerformance?.totals?.applications}</td>
                                    <td className={teamPerformance?.totals?.appliedApproved > 0 ? '' : 'text-nissan-gray'}>{teamPerformance?.totals?.appliedApproved}</td>
                                    <td className={teamPerformance?.totals?.appliedNotApproved > 0 ? '' : 'text-nissan-gray'}>{teamPerformance?.totals?.appliedNotApproved}</td>
                                    <td className={teamPerformance?.totals?.availed > 0 ? '' : 'text-nissan-gray'}>{teamPerformance?.totals?.availed}</td>

                                    <td className="font-bold text-green-600">{Math.round(((teamPerformance?.totals?.appliedApproved + teamPerformance?.totals?.appliedNotApproved) / teamPerformance?.totals?.applications) * 100)}%</td>
                                    <td className="font-bold text-green-600">{Math.round((teamPerformance?.totals?.availed / teamPerformance?.totals?.appliedApproved) * 100)}%</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <section className="grid lg:grid-cols-2 gap-8">
                    <div className="p-4 space-y-4 rounded-xl border border-gray-300 overflow-hidden">
                        <p className="text-lg font-semibold">Team Comparison - Approval Rate</p>
                        <div className="h-70">
                            <ApprovalRate teams={teamPerformance?.teams} />
                        </div>
                    </div>
                    <div className="p-4 space-y-4 rounded-xl border border-gray-300 overflow-hidden">
                        <p className="text-lg font-semibold">Team Comparison - Availment Rate</p>

                        <div className="h-70">
                            <AvailmentRate teams={teamPerformance?.teams} />
                        </div>
                    </div>
                </section>
            </div>
        </div >
    )
}