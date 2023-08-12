module.exports = (sequelize, DataTypes) => {
    const Rewards = sequelize.define("Rewards", {
        Reward_Name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Points_Required: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Reward_Amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        imageFile: {
            type: DataTypes.STRING
        }
    });
    Rewards.associate = (models) => {
        Rewards.belongsTo(models.Admin, {
            foreignKey: "adminId",
            as: 'admin'
        });
    };
    return Rewards;
}