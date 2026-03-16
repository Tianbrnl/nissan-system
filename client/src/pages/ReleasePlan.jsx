import { FileDown, Pen } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import { PageSubTitle, PageTitle } from "../components/ui/ui-labels";
import Select from "../components/ui/Select";
export default function ReleasePlan() {

    const releasePlan = {
        groups: [
            {
                id: 1,
                team: 'NSR1 – Mike',
                actual: 30,
                additionalThisWeek: 30,
                additionalNextWeek: 7,
                monthEndCommitment: 47,
            },
            {
                id: 2,
                team: 'NSR2 – Jhoven',
                actual: 25,
                additionalThisWeek: 6,
                additionalNextWeek: 8,
                monthEndCommitment: 39,
            },
            {
                id: 3,
                team: 'NSR3 – Jay-R',
                actual: 22,
                additionalThisWeek: 5,
                additionalNextWeek: 7,
                monthEndCommitment: 34,
            },
        ],
        totals: {
            actual: 77,
            additionalThisWeek: 18,
            additionalNextWeek: 25,
            monthEndCommitment: 125,
        }
    };

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow p-8 space-y-8 overflow-auto">

                {/* header */}
                <div className="flex justify-between items-center gap-4 flex-wrap">
                    <div>
                        <PageTitle>Release Plan</PageTitle>
                        <PageSubTitle>Monthly release commitments and variance tracking</PageSubTitle>
                    </div>
                    <div className="flex gap-4">
                        <Select
                            placeholder="Select a Month"
                        />
                        <button className="btn bg-nissan-red text-white rounded-xl">
                            <Pen size={16}/> Edit Commitment
                        </button>
                        <button className="btn bg-nissan-red text-white rounded-xl">
                            <FileDown size={16} /> Export
                        </button>

                    </div>
                </div>

                {/* Team Performance */}
                <div className="rounded-xl border border-gray-300 overflow-hidden">
                    <div className="table-style">
                        <table>
                            <thead>
                                <tr>
                                    <td className="rowHeader">GROUP</td>
                                    <td>ACTUAL</td>
                                    <td>ADDITIONAL (THIS WEEK)</td>
                                    <td>ADDTIONAL (NEXT WEEK)</td>
                                    <td className="rowFooter">MONTH-END COMMITMENT?</td>
                                    <td className="varianceCol">VARIANCE</td>
                                </tr>
                            </thead>
                            <tbody>
                                {releasePlan?.groups?.map(group => {

                                    const variance = group.actual - group.monthEndCommitment;
                                    return (
                                        <tr key={group.id}>
                                            <td className="rowHeader">{group.team}</td>
                                            <td>{group.actual}</td>
                                            <td>{group.additionalThisWeek}</td>
                                            <td>{group.additionalNextWeek}</td>
                                            <td className="rowFooter">{group.monthEndCommitment ? group.monthEndCommitment : '-'}</td>
                                            <td className={`varianceCol ${variance > 0 ? 'text-green-600' : 'text-nissan-red'}`}>{variance > 0 ? `+${variance}` : variance}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="rowHeader">TOTAL</td>
                                    <td>{releasePlan?.totals?.actual}</td>
                                    <td>{releasePlan?.totals?.additionalThisWeek}</td>
                                    <td>{releasePlan?.totals?.additionalNextWeek}</td>
                                    <td className="rowFooter">{releasePlan?.totals?.monthEndCommitment}</td>
                                    <td className={`varianceCol ${releasePlan?.totals?.actual - releasePlan?.totals?.monthEndCommitment > 0 ? 'text-green-600' : 'text-nissan-red'}`}>
                                        {releasePlan?.totals?.actual - releasePlan?.totals?.monthEndCommitment > 0 && '+'}
                                        {releasePlan?.totals?.actual - releasePlan?.totals?.monthEndCommitment}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* totals */}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">

                    <div className="border border-gray-300 rounded-xl p-4 space-y-2">
                        <p className="text-sm">Total Actual</p>
                        <h2 className="font-bold">{releasePlan?.totals?.actual}</h2>
                        <p className="text-xs">Current completed releases</p>
                    </div>

                    <div className="border border-gray-300 rounded-xl p-4 space-y-2">
                        <p className="text-sm">Total Commitment</p>
                        <h2 className="font-bold text-blue-600">{releasePlan?.totals?.monthEndCommitment}</h2>
                        <p className="text-xs">Total Commitment</p>
                    </div>

                    <div className="border border-gray-300 rounded-xl p-4 space-y-2">
                        <p className="text-sm">Total Variance</p>
                        <h2 className={`font-bold ${releasePlan?.totals?.actual - releasePlan?.totals?.monthEndCommitment > 0 ? 'text-green-600' : 'text-nissan-red'}`}>{
                            releasePlan?.totals?.actual - releasePlan?.totals?.monthEndCommitment > 0 && '+'}
                            {releasePlan?.totals?.actual - releasePlan?.totals?.monthEndCommitment}
                        </h2>
                        <p className="text-xs">commitment vs Actual</p>
                    </div>
                </div>
            </div>

        </div >
    )
}