import Units from "../models/Unit.js";
import Variants from "../models/Variant.js";

// CREATE VARIANT 
export const createVariantService = async (variant, units) => {
    try {

        if (!variant.trim()) {
            return {
                success: false,
                message: "Please complete all fields."
            };
        }

        const variantCreated = await Variants.create({ name: variant });

        const formattedUnits = units.map(unit => ({
            variantId: variantCreated.id,
            name: unit
        }));
        await Units.bulkCreate(formattedUnits);

        return {
            success: true,
            message: "Model created successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// READ ONE UNIT 
export const readOneUnitService = async (unitId) => {
    try {

        const unit = await Units.findByPk(unitId, {
            attributes: ['id', 'name']
        });

        if (!unit) return { success: false, message: 'Unit on found.' };

        return {
            success: true,
            unit
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// SELECT READ ALL VARIANT 
export const selectReadAllVariantService = async () => {
    try {

        const variants = await Variants.findAll({
            attributes: ['id', 'name']
        });

        if (!variants) return { success: false, variants: [] };

        const formattedvariants = variants.map(variant => ({ value: variant.id, name: variant.name }));

        return {
            success: true,
            variants: formattedvariants
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// SELECT READ ALL UNIT 
export const selectReadAllUnitService = async (variantId) => {
    try {

        const units = await Units.findAll({
            attributes: ['id', 'name'],
            where: { variantId }
        });

        if (!units) return { success: false, units: [] };

        const formattedUnits = units.map(unit => ({ value: unit.id, name: unit.name }));

        return {
            success: true,
            units: formattedUnits
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// UPDATE UNIT 
export const updateUnitService = async (unitId, name) => {
    try {

        if (!name.trim()) {
            return {
                success: false,
                message: "Please complete all fields."
            };
        }

        await Units.update({ name }, { where: { id: unitId } });

        return {
            success: true,
            message: "Unit updated successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// DELETE UNIT
export const deleteUnitService = async (unitId) => {
    try {

        const deletedCount = await Units.destroy({
            where: { id: unitId }
        });

        if (!deletedCount) {
            return {
                success: false,
                message: "Unit not found."
            };
        }

        return {
            success: true,
            message: "Unit deleted successfully"
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// UPDATE VARIANT 
export const updateVariantService = async (variantId, name, units) => {
    try {

        if (!variantId.trim() || !name.trim()) {
            return {
                success: false,
                message: "Please complete all fields."
            };
        }

        await Variants.update({ name }, { where: { id: variantId } });

        const formattedUnits = units.map(unit => ({
            variantId,
            name: unit
        }));
        await Units.bulkCreate(formattedUnits);

        return {
            success: true,
            message: "Variant updated successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}
