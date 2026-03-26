import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function ApprovalRate({ teams = [] }) {

    if (teams.length === 0) {
        return (
            <div className="text-center p-4">
                <h3>NO DATA</h3>
            </div>
        )
    }

    teams = teams?.map(team => {
        const totalApproved = (team?.appliedApproved ?? 0) + (team?.appliedNotApproved ?? 0);
        const approvalRate = team?.applications > 0
            ? Math.round((totalApproved / team.applications) * 100)
            : 0;

        return { name: team?.team, approvalRate };
    });

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teams}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="approvalRate" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
