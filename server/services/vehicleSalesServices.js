import { Pipelines, Teams, Units } from "../models/index.js";
//import { getVehicleSalesByUnitsMonthly } from "../services/vehicleSalesServices.js";
import { Op, Sequelize } from "sequelize";

const reportDateExpression = Sequelize.fn(
  "COALESCE",
  Sequelize.col("pipeline.targetReleased"),
  Sequelize.col("pipeline.monthStart")
);

const reservationDateExpression = Sequelize.col("pipeline.reservedAt");

// vehicleSales report
export const getVehicleSalesByUnitsMonthly = async () => {
  const result = await Pipelines.findAll({
    attributes: [
      "unitId",
      [reportDateExpression, "targetReleaseDate"],
      [Sequelize.fn("COUNT", Sequelize.col("pipeline.unitId")), "total"]
    ],
    include: [
      {
        model: Units,
        attributes: ["id", "name"]
      }
    ],
    group: ["unitId", reportDateExpression, "unit.id", "unit.name"],
    order: [[reportDateExpression, "ASC"]]
  });

  return {
    success: true,
    data: result
  };
};
// payment term monthly
export const getPaymentTermMonthly = async () => {
  const result = await Pipelines.findAll({
    attributes: [
      "transaction",
      [reportDateExpression, "targetReleaseDate"],
      [Sequelize.fn("COUNT", Sequelize.col("transaction")), "total"]
    ],
    group: ["transaction", reportDateExpression],
    order: [[reportDateExpression, "ASC"]]
  });

  return {
    success: true,
    data: result
  };
};
// reservation per month
export const getReservationByTeamMonthly = async () => {
  const result = await Pipelines.findAll({
    attributes: [
      "teamId",
      [reservationDateExpression, "reservedDate"],
      [Sequelize.fn("COUNT", Sequelize.col("teamId")), "total"]
    ],
    include: [
      {
        model: Teams,
        attributes: ["teamCode", "teamLeader"]
      }
    ],
    where: {
      reservedAt: {
        [Op.not]: null,
        [Op.ne]: "0000-00-00"
      }
    },
    group: ["teamId", reservationDateExpression, "team.id", "team.teamCode", "team.teamLeader"],
    order: [[reservationDateExpression, "ASC"]]
  });

  return {
    success: true,
    data: result
  };
};
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
