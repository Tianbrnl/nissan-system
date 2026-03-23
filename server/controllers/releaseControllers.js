import { getReleasePlan } from "../services/releaseServices.js";

export const releasePlanReport = async (req, res) => {
  try {
    const result = await getReleasePlan();
    res.json(result);
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};