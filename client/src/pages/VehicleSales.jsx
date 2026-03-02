import Sidemenu from "../components/Sidemenu";
import { PageSubTitle, PageTitle } from "../components/ui/ui-labels";
import Select from "../components/ui/Select";
import TeamPerformance from "../components/TeamPerformance";
import ModelDistribution from "../components/ModelDistribution";
import ModelContributionPerTeam from "../components/ModelContributionPerTeam";

export default function VehicleSales() {

    const totals = {
        totalUnitSold: {
            total: 99
        },
        topTeam: {
            total: 'NSR1-Mike',
            units: 37
        },
        totalModel: {
            total: 'Kicks',
            units: 18
        },
        bestSellingModelUnits: {
            total: 18
        }
    };

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

    const teamSales = {
        models: [
            'Kicks',
            'E26',
            'N18',
            'Patrol',
            'D23',
            'Terra',
            'Livina',
            'Nissan Z',
            'Prem',
        ],
        teams: [
            {
                name: 'NSR1 – Mike',
                data: [7, 4, 5, 3, 6, 4, 3, 2, 3]
            },
            {
                name: 'NSR2 – Jhoven',
                data: [6, 5, 4, 2, 5, 3, 4, 3, 4]
            },
            {
                name: 'NSR3 – Jayr',
                data: [5, 3, 3, 3, 4, 4, 2, 2, 2]
            }
        ],
        totals: [18, 12, 12, 8, 15, 11, 9, 7, 7]
    }

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow p-8 space-y-8 overflow-auto">

                {/* header */}
                <div className="flex justify-between items-center gap-4 flex-wrap">
                    <div>
                        <PageTitle>FEB 2026 PERFORMANCE PER GROUP</PageTitle>
                        <PageSubTitle>Vehicle sales breackdown by team and model</PageSubTitle>
                    </div>
                    <Select options={dates} />
                </div>

                {/* totals */}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">

                    <div className="border border-gray-300 rounded-xl p-4 space-y-2">
                        <p className="text-sm">Total Units Sold</p>
                        <h2 className="font-bold">99</h2>
                    </div>

                    <div className="border border-gray-300 rounded-xl p-4 space-y-2">
                        <p className="text-sm">Top Team</p>
                        <h4 className="font-bold text-nissan-red">{totals?.topTeam?.total}</h4>
                        <p className="text-gray-500 text-sm">{totals?.topTeam?.units} units</p>
                    </div>

                    <div className="border border-gray-300 rounded-xl p-4 space-y-2">
                        <p className="text-sm">Total Model</p>
                        <h4 className="font-bold text-green-600">{totals?.totalModel?.total}</h4>
                        <p className="text-gray-500 text-sm">{totals?.totalModel?.units} units</p>
                    </div>

                    <div className="border border-gray-300 rounded-xl p-4 space-y-2">
                        <p className="text-sm">Best Selling Model Units</p>
                        <h2 className="font-bold">{totals?.bestSellingModelUnits?.total}</h2>
                    </div>
                </div>

                {/* Team Performance */}
                <div className="rounded-xl border border-gray-300 overflow-hidden">
                    <div className="table-style">
                        <table>
                            <thead>
                                <tr>
                                    <td className="rowHeader">TEAM</td>
                                    {teamSales?.models?.map((model, index) => (
                                        <td key={index}>{model}</td>
                                    ))}
                                    <td className="rowFooter">TOTAL</td>
                                </tr>
                            </thead>
                            <tbody>
                                {teamSales?.teams?.map((team, index) => (
                                    <tr key={index}>
                                        <td className="rowHeader">{team?.name}</td>
                                        {team?.data?.map((d, index) => (
                                            <td key={index}>{d}</td>
                                        ))}
                                        <td className="rowFooter">{team?.data?.reduce((sum, num) => sum + num, 0) ?? 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="rowHeader">TOTAL</td>
                                    {teamSales?.totals?.map((total, index) => (
                                        <td key={index} className={total > 0 ? '' : 'text-nissan-gray'}>{total}</td>
                                    ))}
                                    <td className={`${(teamSales?.totals?.reduce((sum, num) => sum + num, 0) ?? 0) ? '' : 'text-nissan-gray'} rowFooter`}>
                                        {teamSales?.totals?.reduce((sum, num) => sum + num, 0) ?? 0}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <section className="max-lg:grid max-lg:grid-cols-1 lg:flex gap-8">
                    <div className="lg:flex-2 p-4 space-y-4 rounded-xl border border-gray-300 overflow-hidden">
                        <p className="text-lg font-semibold">Team Performance - (Total Units)</p>
                        <div className="h-70">
                            <TeamPerformance teams={teamSales?.teams} />
                        </div>
                    </div>
                    <div className="lg:flex-1 p-4 space-y-4 rounded-xl border border-gray-300 overflow-hidden">
                        <p className="text-lg font-semibold">Model Destribution</p>

                        <div className="h-70">
                            <ModelDistribution />
                        </div>
                    </div>
                </section>

                <section className="lg:flex-1 p-4 space-y-4 rounded-xl border border-gray-300 overflow-hidden">
                    <p className="text-lg font-semibold">Model Contribution per Team</p>

                    <div className="h-70">
                        <ModelContributionPerTeam />
                    </div>
                </section>
            </div>
        </div >
    )
}