import express from 'express';
import { createVariantController, deleteUnitController, readOneUnitController, selectReadAllUnitController, selectReadAllVariantController, updateUnitController, updateVariantController } from '../controllers/variantControllers.js';

const variantRouter = express.Router();

// CREATE VARIANT
variantRouter.post('/create', createVariantController);

// READ ONE UNIT
variantRouter.get('/unit/readOne/:unitId', readOneUnitController);

// SELECT READ ALL VARIANT
variantRouter.get('/select/readAll', selectReadAllVariantController);

// SELECT READ ALL UNIT
variantRouter.get('/unit/select/readAll/:variantId', selectReadAllUnitController);

// UPDATE UNIT
variantRouter.put('/unit/update/:unitId', updateUnitController);

// DELETE UNIT
variantRouter.delete('/unit/delete/:unitId', deleteUnitController);

// UPDATE VARIANT
variantRouter.put('/update/:variantId', updateVariantController);

export default variantRouter;
