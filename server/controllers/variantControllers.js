import { createVariantService, readOneUnitService, selectReadAllUnitService, selectReadAllVariantService, updateUnitService, updateVariantService } from "../services/variantServices.js";

// CREATE VARIANT 
export const createVariantController = async (req, res) => {
    try {
        const { variant, units } = req.body;
        const result = await createVariantService(variant, units);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// READ ONE VARIANT 
export const readOneUnitController = async (req, res) => {
    try {
        const { unitId } = req.params;
        const result = await readOneUnitService(unitId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// SELECT READ ALL VARIANT 
export const selectReadAllVariantController = async (req, res) => {
    try {

        const result = await selectReadAllVariantService();

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// SELECT READ ALL UNIT 
export const selectReadAllUnitController = async (req, res) => {
    try {
        const { variantId } = req.params;

        console.log(variantId);

        const result = await selectReadAllUnitService(variantId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// UPDATE UNIT 
export const updateUnitController = async (req, res) => {
    try {
        const { unitId } = req.params;
        const { name } = req.body;
        const result = await updateUnitService(unitId, name);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// UPDATE VARIANT 
export const updateVariantController = async (req, res) => {
    try {
        const { variantId } = req.params;
        const { name, units } = req.body;
        const result = await updateVariantService(variantId, name, units);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}