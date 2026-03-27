import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function ModelContributionPerTeam({ teams = [] }) {

    // 🔥 Flatten the nested structure
    const formattedData = teams.map(team => {
        const unitData = {};

        team.units.forEach(unit => {
            unitData[unit.name] = unit.data;
        });

        return {
            name: team.team,
            ...unitData
        };
    });

    // Extract model keys dynamically
    const unitKeys = teams[0]?.units.map(unit => unit.name);

    return (
        <>
            {formattedData.length > 0 ?
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={formattedData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        {/* <Legend /> */}

                        {unitKeys?.map((unit, index) => (
                            <Bar
                                key={unit}
                                dataKey={unit}
                                stackId="a"   // remove this if you want grouped bars
                                fill={`hsl(${index * 40}, 70%, 50%)`}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
                :
                < div className="text-center p-4" >
                    <h3>NO DATA</h3>
                </div >
            }
        </>
    );
}