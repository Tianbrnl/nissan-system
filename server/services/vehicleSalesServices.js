import { Pipelines, Teams, Units } from "../models/index.js";
import { Op, Sequelize } from "sequelize";

const reportDateExpression = Sequelize.fn(
  "COALESCE",
  Sequelize.col("pipeline.targetReleased"),
  Sequelize.col("pipeline.monthStart")
);

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
      "id",
      "teamId",
      [Sequelize.cast(Sequelize.col("reservedAt"), "CHAR"), "reservedDate"],
      [Sequelize.literal("1"), "total"]
    ],
    where: {
      [Op.and]: [
        Sequelize.literal("teamId IS NOT NULL"),
        Sequelize.literal("reservedAt IS NOT NULL"),
        Sequelize.literal("CAST(reservedAt AS CHAR) <> '0000-00-00'"),
        Sequelize.literal("CAST(reservedAt AS CHAR) <> 'Invalid date'")
      ]
    },
    order: [[Sequelize.literal("CAST(reservedAt AS CHAR)"), "ASC"]],
    raw: true
  });

  const teamIds = [...new Set(result.map((row) => row.teamId).filter(Boolean))];
  const teams = teamIds.length
    ? await Teams.findAll({
        attributes: ["id", "teamCode", "teamLeader"],
        where: {
          id: teamIds
        },
        raw: true
      })
    : [];

  const teamMap = new Map(teams.map((team) => [team.id, team]));
  const data = result.map((row) => {
    const team = teamMap.get(row.teamId) || null;

    return {
      ...row,
      teamCode: team?.teamCode ?? null,
      teamLeader: team?.teamLeader ?? null,
      team
    };
  });

  return {
    success: true,
    data
  };
};

// READ ALL TEAM PERFORMANCE
export const readAllTeamPerformanceService = async (monthYear) => {
  try {

    // Parse monthYear into start and end dates
    const [year, month] = monthYear.split("-");
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    // Fetch units and teams
    const units = await Units.findAll({
      attributes: ["id", "name"],
      raw: true
    });

    const teams = await Teams.findAll({
      attributes: ["id", "teamCode", "teamLeader"],
      raw: true
    });

    // Fetch sales
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

    // Build sales map
    const salesMap = {};
    sales.forEach((s) => {
      if (!salesMap[s.teamId]) salesMap[s.teamId] = {};
      salesMap[s.teamId][s.unitId] = Number(s.total);
    });

    // Compute unit totals
    const unitTotalsMap = {};
    units.forEach((unit) => {
      unitTotalsMap[unit.id] = sales
        .filter((s) => s.unitId === unit.id)
        .reduce((sum, s) => sum + Number(s.total), 0);
    });

    // Remove units where all teams have 0
    const validUnits = units.filter((u) => unitTotalsMap[u.id] > 0);

    // Build team performance
    let teamPerformance = teams.map((team) => {

      const counts = validUnits.map((unit) => ({
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

    // ✅ Remove teams with total = 0
    teamPerformance = teamPerformance.filter(team => team.total > 0);

    // Build unit totals
    const unitTotals = validUnits.map((unit) => ({
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
