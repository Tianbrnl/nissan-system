import { Pipelines, Teams, Units } from "../models/index.js";
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
    // Parse monthYear into start and end dates
    const [year, month] = monthYear.split("-");
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    // Fetch all units and teams
    const units = await Units.findAll({ attributes: ["id", "name"], raw: true });
    const teams = await Teams.findAll({ attributes: ["id", "teamCode", "teamLeader"], raw: true });

    // Fetch all sales in one query
    const sales = await Pipelines.findAll({
      attributes: [
        "teamId",
        "unitId",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "total"]
      ],
      where: {
        status: "Sold",
        targetReleased: {
          [Op.gte]: startDate,
          [Op.lt]: endDate
        }
      },
      group: ["teamId", "unitId"],
      raw: true
    });

    // Build a map for fast lookup
    const salesMap = {};
    sales.forEach(s => {
      if (!salesMap[s.teamId]) salesMap[s.teamId] = {};
      salesMap[s.teamId][s.unitId] = Number(s.total);
    });

    // Compute totals per unit
    const unitTotalsMap = {};
    units.forEach(unit => {
      unitTotalsMap[unit.id] = sales
        .filter(s => s.unitId === unit.id)
        .reduce((sum, s) => sum + Number(s.total), 0);
    });

    // Keep only units that have at least 1 sale across all teams
    const validUnits = units.filter(u => unitTotalsMap[u.id] > 0);

    // Build team performance
    const teamPerformance = teams.map(team => {
      const counts = validUnits.map(unit => ({
        unitId: unit.id,
        name: unit.name,
        count: salesMap[team.id]?.[unit.id] || 0
      }));

      const total = counts.reduce((sum, c) => sum + c.count, 0);

      return {
        teamId: team.id,
        team: `${team.teamCode} - ${team.teamLeader}`,
        counts,
        total
      };
    });

    // Build filtered unit totals
    const unitTotals = validUnits.map(unit => ({
      unitId: unit.id,
      name: unit.name,
      total: unitTotalsMap[unit.id]
    }));

    return {
      success: true,
      teamPerformance,
      unitTotals
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

// UNIT DISTRIBUTION
export const unitDestributionService = async (monthYear) => {
  try {
    // Parse monthYear into start and end dates
    const [year, month] = monthYear.split("-");
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    // Fetch all sales grouped by unit
    const sales = await Pipelines.findAll({
      attributes: [
        "unitId",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "total"]
      ],
      where: {
        status: "Sold",
        targetReleased: {
          [Op.gte]: startDate,
          [Op.lt]: endDate
        }
      },
      group: ["unitId"],
      raw: true
    });

    if (!sales.length) {
      return {
        success: true,
        data: []
      };
    }

    // Fetch unit names
    const units = await Units.findAll({
      attributes: ["id", "name"],
      where: {
        id: sales.map(s => s.unitId)
      },
      raw: true
    });

    // Map unitId to name
    const unitMap = {};
    units.forEach(u => {
      unitMap[u.id] = u.name;
    });

    // Calculate total sales
    const totalSales = sales.reduce((sum, s) => sum + Number(s.total), 0);

    // Build distribution array with percentage
    const distribution = sales.map(s => ({
      unitId: s.unitId,
      name: unitMap[s.unitId] || "Unknown",
      count: Number(s.total),
      percentage: ((Number(s.total) / totalSales) * 100).toFixed(2) // 2 decimals
    }));

    return {
      success: true,
      data: distribution
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};