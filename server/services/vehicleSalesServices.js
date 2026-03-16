import { Pipelines, Teams, Units } from "../models/index.js";

// READ ALL TEAM PERFORMANCE
export const readAllTeamPerformanceService = async (monthYear) => {
    try {

        const units = await Units.findAll({
            attributes: ['id', 'name']
        });

        const teams = await Teams.findAll({
            attributes: ['id', 'teamCode', 'teamLeader'],
        });

        let teamPerformance = [];
        let unitTotals = {};

        for (const unit of units) {
            unitTotals[unit.id] = {
                unitId: unit.id,
                name: unit.name,
                total: 0
            };
        }

        const startDate = `${monthYear}-01`;
        const endDate = `${monthYear}-28`;
        
        for (const team of teams) {

            const obj = {
                teamId: team.id,
                team: `${team.teamCode} - ${team.teamLeader}`,
                counts: [],
                total: 0
            };

            for (const unit of units) {

                const count = await Pipelines.count({
                    where: {
                        teamId: team.id,
                        unitId: unit.id,
                        // targetReleased: {
                        //     [Op.between]: [startDate, endDate]
                        // }
                    }
                });

                obj.counts.push({
                    unitId: unit.id,
                    name: unit.name,
                    count
                });

                obj.total += count;
                unitTotals[unit.id].total += count;
            }

            teamPerformance.push(obj);
        }

        // remove units where total = 0
        const validUnitIds = Object.values(unitTotals)
            .filter(unit => unit.total > 0)
            .map(unit => unit.unitId);

        // filter unitTotals
        const filteredUnitTotals = Object.values(unitTotals)
            .filter(unit => unit.total > 0);

        // filter each team's counts
        teamPerformance = teamPerformance.map(team => ({
            ...team,
            counts: team.counts.filter(c => validUnitIds.includes(c.unitId))
        }));

        return {
            success: true,
            teamPerformance,
            unitTotals: filteredUnitTotals
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}