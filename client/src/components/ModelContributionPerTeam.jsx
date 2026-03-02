import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

const teams = [
    {
        name: 'NSR1 – Mike',
        models: [
            { name: 'Kicks', data: 7 },
            { name: 'E26', data: 4 },
            { name: 'N18', data: 5 },
            { name: 'Patrol', data: 3 },
            { name: 'D23', data: 6 },
            { name: 'Terra', data: 4 },
            { name: 'Livina', data: 3 },
            { name: 'NissanZ', data: 2 },
            { name: 'Prem', data: 3 },
        ]
    },
    {
        name: 'NSR2 – Jhoven',
        models: [
            { name: 'Kicks', data: 6 },
            { name: 'E26', data: 5 },
            { name: 'N18', data: 4 },
            { name: 'Patrol', data: 2 },
            { name: 'D23', data: 5 },
            { name: 'Terra', data: 4 },
            { name: 'Livina', data: 4 },
            { name: 'NissanZ', data: 3 },
            { name: 'Prem', data: 2 },
        ]
    },
    {
        name: 'NSR3 – Jayr',
        models: [
            { name: 'Kicks', data: 5 },
            { name: 'E26', data: 3 },
            { name: 'N18', data: 3 },
            { name: 'Patrol', data: 3 },
            { name: 'D23', data: 4 },
            { name: 'Terra', data: 4 },
            { name: 'Livina', data: 2 },
            { name: 'NissanZ', data: 2 },
            { name: 'Prem', data: 2 },
        ]
    },
];

// 🔥 Flatten the nested structure
const formattedData = teams.map(team => {
    const modelData = {};

    team.models.forEach(model => {
        modelData[model.name] = model.data;
    });

    return {
        name: team.name,
        ...modelData
    };
});

// Extract model keys dynamically
const modelKeys = teams[0].models.map(m => m.name);

export default function ModelContributionPerTeam() {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />

                {modelKeys.map((model, index) => (
                    <Bar
                        key={model}
                        dataKey={model}
                        stackId="a"   // remove this if you want grouped bars
                        fill={`hsl(${index * 40}, 70%, 50%)`}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
}