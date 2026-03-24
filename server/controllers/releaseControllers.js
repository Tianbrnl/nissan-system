import { getReleasePlan, saveReleasePlan } from "../services/releaseServices.js";

export const releasePlanReport = async (req, res) => {
  try {
    const result = await getReleasePlan(req.query.date);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateReleasePlan = async (req, res) => {
  try {
    const { date, groups } = req.body;
    const result = await saveReleasePlan({ date, groups });

    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
