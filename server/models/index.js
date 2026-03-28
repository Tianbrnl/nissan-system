import Teams from "./Team.js";
import TeamMembers from "./TeamMember.js";
import Pipelines from "./Pipeline.js";
import Variants from "./Variant.js";
import Units from "./Unit.js";
import ReleasePlanCommitments from "./ReleasePlanCommitment.js";

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

Teams.hasMany(TeamMembers, {
    foreignKey: "teamId",
    as: "members",
    onDelete: "CASCADE",
});

TeamMembers.belongsTo(Teams, {
    foreignKey: "teamId",
    as: "team",
});

TeamMembers.hasMany(Pipelines, {
    foreignKey: "memberId",
    as: "pipelines",
    onDelete: "SET NULL",
});

Pipelines.belongsTo(TeamMembers, {
    foreignKey: "memberId",
    as: "member",
});

export { Teams, TeamMembers, Pipelines, Units, Variants, ReleasePlanCommitments };
