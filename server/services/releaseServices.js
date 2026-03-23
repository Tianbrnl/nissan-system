import { Pipelines, Teams } from "../models/index.js";
import { Op} from "sequelize";

export const getReleasePlan = async () => {
  try {
    const today = new Date();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const nextWeekStart = new Date(endOfWeek);
    nextWeekStart.setDate(endOfWeek.getDate() + 1);

    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);

    const pipelines = await Pipelines.findAll({
      include: [
        {
          model: Teams,
          attributes: ["teamCode"]
        }
      ],
      where: {
        targetReleased: {
          [Op.not]: null
        }
      },
      raw: true,
      nest: true
    });

    const resultMap = {};

    pipelines.forEach(p => {
      const team = p.team?.teamCode || "Unknown";
      const date = new Date(p.targetReleased);

      if (!resultMap[team]) {
        resultMap[team] = {
          team,
          actual: 0,
          thisWeek: 0,
          nextWeek: 0,
          monthEnd: 0
        };
      }

      // ACTUAL
      if (date <= today) resultMap[team].actual++;

      // THIS WEEK
      if (date >= startOfWeek && date <= endOfWeek) {
        resultMap[team].thisWeek++;
      }

      // NEXT WEEK
      if (date >= nextWeekStart && date <= nextWeekEnd) {
        resultMap[team].nextWeek++;
      }

      // MONTH-END
      if (
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      ) {
        resultMap[team].monthEnd++;
      }
    });

    const data = Object.values(resultMap).map(item => ({
      ...item,
      variance: item.monthEnd - item.actual
    }));

    return {
      success: true,
      data
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};