import Teams from "./Team.js";
import Pipelines from "./Pipeline.js";
import Variants from "./Variant.js";
import Units from "./Unit.js";

Variants.hasMany(Units, {
    foreignKey: 'variantId',
    onDelete: "CASCADE"
})

Units.belongsTo(Variants, {
    foreignKey: "variantId",
});

Units.hasMany(Pipelines, {
    foreignKey: "unitId",
    onDelete: "CASCADE",
});

Pipelines.belongsTo(Units, {
    foreignKey: "unitId",
});

Teams.hasMany(Pipelines, {
    foreignKey: "teamId",
    onDelete: "CASCADE",
});

Pipelines.belongsTo(Teams, {
    foreignKey: "teamId",
});

export { Teams, Pipelines, Units, Variants };
