import { FileDown, Pen } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import { PageSubTitle, PageTitle } from "../components/ui/ui-labels";
import Select from "../components/ui/Select";
import { useState } from "react";
import { exportToWord } from "../utils/ExportToWord";

export default function ReleasePlan() {
    const [releasePlan, setReleasePlan] = useState({
        groups: [
            {
                id: 1,
                team: 'NSR1 – Mike',
                actual: 48,
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
    });
    
    const [isEditing, setIsEditing] = useState(false);
    const [editedValues, setEditedValues] = useState({});
    const [selectedDate, setSelectedDate] = useState('2026-03-23');

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    // Calculate totals whenever releasePlan changes
    const calculateTotals = (groups) => {
        return {
            actual: groups.reduce((sum, g) => sum + g.actual, 0),
            additionalThisWeek: groups.reduce((sum, g) => sum + g.additionalThisWeek, 0),
            additionalNextWeek: groups.reduce((sum, g) => sum + g.additionalNextWeek, 0),
            monthEndCommitment: groups.reduce((sum, g) => sum + (editedValues[g.id] || g.monthEndCommitment), 0),
        };
    };

    const handleEditCommitment = (groupId, value) => {
        const numValue = parseInt(value) || 0;
        setEditedValues(prev => ({
            ...prev,
            [groupId]: numValue
        }));
    };

    const handleSaveCommitments = () => {
        // Update the releasePlan with edited values
        const updatedGroups = releasePlan.groups.map(group => ({
            ...group,
            monthEndCommitment: editedValues[group.id] !== undefined ? editedValues[group.id] : group.monthEndCommitment
        }));
        
        setReleasePlan(prev => ({
            ...prev,
            groups: updatedGroups,
            totals: calculateTotals(updatedGroups)
        }));
        
        setIsEditing(false);
    };

    const handleExport = async () => {
        const headers = ["GROUP", "ACTUAL", "ADDITIONAL (THIS WEEK)", "ADDITIONAL (NEXT WEEK)", "MONTH-END COMMITMENT", "VARIANCE"];
        const rows = releasePlan.groups.map(group => {
            const commitment = editedValues[group.id] !== undefined ? editedValues[group.id] : group.monthEndCommitment;
            const variance = Math.abs(group.actual - commitment);
            return [
                group.team,
                group.actual,
                group.additionalThisWeek,
                group.additionalNextWeek,
                commitment,
                variance
            ];
        });
        
        const totals = calculateTotals(releasePlan.groups);
        const varianceTotal = Math.abs(totals.actual - totals.monthEndCommitment);
        rows.push([
            "TOTAL",
            totals.actual,
            totals.additionalThisWeek,
            totals.additionalNextWeek,
            totals.monthEndCommitment,
            varianceTotal
        ]);

        await exportToWord({
            title: "Release Plan",
            subtitle: "Monthly release commitments and variance tracking",
            headers,
            rows,
            fileName: "Release_Plan_Report"
        });
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
                    <div className="flex gap-4 items-center">
                        <input 
                            type="date" 
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-nissan-red bg-white hover:bg-gray-50 font-medium transition-colors"
                        />

                        <button className="btn bg-nissan-red text-white rounded-xl" onClick={handleExport}>
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
                                    <td className="rowFooter flex items-center justify-between gap-2">
                                        <span>MONTH-END COMMITMENT</span>
                                        <button 
                                            onClick={() => isEditing ? handleSaveCommitments() : setIsEditing(true)}
                                            className="hover:bg-gray-200 p-1 rounded transition-colors"
                                        >
                                            <Pen size={16} />
                                        </button>
                                    </td>
                                    <td className="varianceCol">VARIANCE</td>
                                </tr>
                            </thead>
                            <tbody>
                                {releasePlan?.groups?.map(group => {
                                    const commitment = editedValues[group.id] !== undefined ? editedValues[group.id] : group.monthEndCommitment;
                                    const variance = Math.abs(group.actual - commitment);
                                    const isNegative = group.actual < commitment;
                                    
                                    return (
                                        <tr key={group.id}>
                                            <td className="rowHeader">{group.team}</td>
                                            <td>{group.actual}</td>
                                            <td>{group.additionalThisWeek}</td>
                                            <td>{group.additionalNextWeek}</td>
                                            <td className="rowFooter">
                                                {isEditing ? (
                                                    <input 
                                                        type="number" 
                                                        value={editedValues[group.id] !== undefined ? editedValues[group.id] : group.monthEndCommitment}
                                                        onChange={(e) => handleEditCommitment(group.id, e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded"
                                                    />
                                                ) : (
                                                    commitment
                                                )}
                                            </td>
                                            <td className={`varianceCol ${isNegative ? 'text-nissan-red' : 'text-green-600'}`}>
                                                {variance}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="rowHeader">TOTAL</td>
                                    <td>{calculateTotals(releasePlan.groups).actual}</td>
                                    <td>{calculateTotals(releasePlan.groups).additionalThisWeek}</td>
                                    <td>{calculateTotals(releasePlan.groups).additionalNextWeek}</td>
                                    <td className="rowFooter">
                                        {isEditing ? (
                                            <span className="text-gray-500">{calculateTotals(releasePlan.groups).monthEndCommitment}</span>
                                        ) : (
                                            calculateTotals(releasePlan.groups).monthEndCommitment
                                        )}
                                    </td>
                                    <td className={`varianceCol ${calculateTotals(releasePlan.groups).actual < calculateTotals(releasePlan.groups).monthEndCommitment ? 'text-nissan-red' : 'text-green-600'}`}>
                                        {Math.abs(calculateTotals(releasePlan.groups).actual - calculateTotals(releasePlan.groups).monthEndCommitment)}
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
                        <h2 className="font-bold">{calculateTotals(releasePlan.groups).actual}</h2>
                        <p className="text-xs">Current completed releases</p>
                    </div>

                    <div className="border border-gray-300 rounded-xl p-4 space-y-2">
                        <p className="text-sm">Total Commitment</p>
                        <h2 className="font-bold text-blue-600">{calculateTotals(releasePlan.groups).monthEndCommitment}</h2>
                        <p className="text-xs">Total Commitment</p>
                    </div>

                    <div className="border border-gray-300 rounded-xl p-4 space-y-2">
                        <p className="text-sm">Total Variance</p>
                        <h2 className={`font-bold ${calculateTotals(releasePlan.groups).actual >= calculateTotals(releasePlan.groups).monthEndCommitment ? 'text-green-600' : 'text-nissan-red'}`}>
                            {Math.abs(calculateTotals(releasePlan.groups).actual - calculateTotals(releasePlan.groups).monthEndCommitment)}
                        </h2>
                        <p className="text-xs">commitment vs Actual</p>
                    </div>
                </div>
            </div>

        </div >
    )
}