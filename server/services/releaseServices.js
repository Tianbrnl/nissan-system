import { Op } from "sequelize";
import { Pipelines, ReleasePlanCommitments, Teams } from "../models/index.js";

const toDateString = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return value;
};

const getDateContext = (dateString) => {
  const selectedDate = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(selectedDate.getTime())) {
    return null;
  }

  const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  monthStart.setHours(0, 0, 0, 0);

  const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  monthEnd.setHours(23, 59, 59, 999);
  const selectedDateEnd = new Date(selectedDate);
  selectedDateEnd.setHours(23, 59, 59, 999);

  const reportDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-01`;

  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const nextWeekStart = new Date(endOfWeek);
  nextWeekStart.setDate(endOfWeek.getDate() + 1);
  nextWeekStart.setHours(0, 0, 0, 0);

  const nextWeekEnd = new Date(nextWeekStart);
  nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
  nextWeekEnd.setHours(23, 59, 59, 999);

  return {
    dateString,
    reportDate,
    selectedDate,
    selectedDateEnd,
    monthStart,
    monthEnd,
    startOfWeek,
    endOfWeek,
    nextWeekStart,
    nextWeekEnd
  };
};

const getMonthEndString = (context) => {
  return `${context.selectedDate.getFullYear()}-${String(context.selectedDate.getMonth() + 1).padStart(2, "0")}-${String(context.monthEnd.getDate()).padStart(2, "0")}`;
};

const getMonthKey = (dateString) => dateString.slice(0, 7);

const getMonthlyCommitments = async (context, options = {}) => {
  const commitments = await ReleasePlanCommitments.findAll({
    where: {
      reportDate: {
        [Op.between]: [context.reportDate, getMonthEndString(context)]
      }
    },
    order: [["updatedAt", "DESC"], ["reportDate", "ASC"]],
    ...options
  });

  const normalizedByTeam = new Map();

  commitments.forEach((commitment) => {
    const key = commitment.team;

    if (!normalizedByTeam.has(key)) {
      normalizedByTeam.set(key, commitment);
    }
  });

  return {
    commitments,
    normalizedByTeam
  };
};

const buildReleasePlan = async (dateString) => {
  const context = getDateContext(dateString);

  if (!context) {
    return {
      success: false,
      message: "Invalid date. Use YYYY-MM-DD."
    };
  }

  console.log("[release-plan] incoming date from request:", dateString);
  console.log("[release-plan] processed dateString:", context.dateString);
  console.log("[release-plan] computed reportDate:", context.reportDate);
  console.log("[release-plan] month end:", getMonthEndString(context));

  const [teams, pipelines, monthlyCommitments] = await Promise.all([
    Teams.findAll({
      attributes: ["teamCode"],
      raw: true
    }),
    Pipelines.findAll({
      include: [
        {
          model: Teams,
          attributes: ["teamCode"]
        }
      ],
      where: {
        targetReleased: {
          [Op.between]: [context.reportDate, getMonthEndString(context)]
        }
      },
      raw: true,
      nest: true
    }),
    getMonthlyCommitments(context, { raw: true })
  ]);

  console.log("[release-plan] pipelines returned:", pipelines.length);

  const savedCommitmentMap = new Map();

  monthlyCommitments.normalizedByTeam.forEach((commitment, team) => {
    savedCommitmentMap.set(team, commitment.monthEnd);
  });

  monthlyCommitments.commitments.forEach((commitment) => {
    console.log("[release-plan] saved reportDate in DB:", commitment.reportDate, "team:", commitment.team, "monthEnd:", commitment.monthEnd);
  });

  const resultMap = {};

  teams.forEach(({ teamCode }) => {
    resultMap[teamCode] = {
      team: teamCode,
      actual: 0,
      thisWeek: 0,
      nextWeek: 0,
      monthEnd: savedCommitmentMap.get(teamCode) ?? 0
    };
  });

  pipelines.forEach((pipeline) => {
    const team = pipeline.team?.teamCode || "Unknown";
    const releaseDateString = toDateString(pipeline.targetReleased);
    const releaseDate = releaseDateString ? new Date(`${releaseDateString}T00:00:00`) : null;

    if (!releaseDate || Number.isNaN(releaseDate.getTime())) {
      return;
    }

    if (getMonthKey(releaseDateString) !== getMonthKey(context.reportDate)) {
      return;
    }

    if (!resultMap[team]) {
      resultMap[team] = {
        team,
        actual: 0,
        thisWeek: 0,
        nextWeek: 0,
        monthEnd: savedCommitmentMap.get(team) ?? 0
      };
    }

    if (releaseDate <= context.selectedDateEnd) {
      resultMap[team].actual += 1;
    }

    if (
      releaseDate > context.selectedDateEnd &&
      releaseDate >= context.startOfWeek &&
      releaseDate <= context.endOfWeek &&
      releaseDate >= context.monthStart &&
      releaseDate <= context.monthEnd
    ) {
      resultMap[team].thisWeek += 1;
    }

    if (
      releaseDate > context.selectedDateEnd &&
      releaseDate >= context.nextWeekStart &&
      releaseDate <= context.nextWeekEnd &&
      releaseDate >= context.monthStart &&
      releaseDate <= context.monthEnd
    ) {
      resultMap[team].nextWeek += 1;
    }

    if (
      savedCommitmentMap.get(team) === undefined &&
      releaseDate >= context.monthStart &&
      releaseDate <= context.monthEnd
    ) {
      resultMap[team].monthEnd += 1;
    }
  });

  return {
    success: true,
    data: Object.values(resultMap)
      .sort((a, b) => a.team.localeCompare(b.team))
      .map((item) => ({
        team: item.team,
        actual: item.actual,
        thisWeek: item.thisWeek,
        nextWeek: item.nextWeek,
        monthEnd: item.monthEnd
      }))
  };
};

export const getReleasePlan = async (date) => {
  try {
    const dateString = toDateString(date);

    if (!dateString) {
      return {
        success: false,
        message: "Date query parameter is required and must use YYYY-MM-DD."
      };
    }

    return await buildReleasePlan(dateString);
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

export const saveReleasePlan = async ({ date, groups } = {}) => {
  try {
    const dateString = toDateString(date);
    const context = getDateContext(dateString);

    if (!dateString || !context) {
      return {
        success: false,
        message: "Invalid date. Use YYYY-MM-DD."
      };
    }

    if (!Array.isArray(groups)) {
      return {
        success: false,
        message: "Groups payload must be an array."
      };
    }

    console.log("[release-plan] selected date for save:", dateString);
    console.log("[release-plan] computed reportDate for save:", context.reportDate);

    await Promise.all(groups.map(async (group) => {
      const team = group?.team;
      const monthEnd = Number(group?.monthEnd);

      if (!team || Number.isNaN(monthEnd)) {
        return;
      }

      const existingCommitments = await ReleasePlanCommitments.findAll({
        where: {
          team,
          reportDate: {
            [Op.between]: [context.reportDate, getMonthEndString(context)]
          }
        },
        order: [["updatedAt", "DESC"], ["reportDate", "ASC"]]
      });

      const primaryCommitment = existingCommitments.find(
        (commitment) => commitment.reportDate === context.reportDate
      ) || existingCommitments[0];
      const duplicateCommitments = existingCommitments.filter(
        (commitment) => commitment.id !== primaryCommitment?.id
      );

      if (primaryCommitment) {
        if (duplicateCommitments.length > 0) {
          await Promise.all(duplicateCommitments.map((commitment) => commitment.destroy()));
        }

        await primaryCommitment.update({
          reportDate: context.reportDate,
          monthEnd
        });
      } else {
        await ReleasePlanCommitments.create({
          team,
          reportDate: context.reportDate,
          monthEnd
        });
      }

      console.log("[release-plan] saved reportDate in DB:", context.reportDate, "team:", team, "monthEnd:", monthEnd);
    }));

    return await buildReleasePlan(dateString);
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};
