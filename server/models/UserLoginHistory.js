module.exports = (sequelize, DataTypes) => {
    const UserLoginHistory = sequelize.define("UserLoginHistory", {
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        loginSuccess: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        }
    });
    UserLoginHistory.associate = (models) => {
        UserLoginHistory.belongsTo(models.User, {
            foreignKey: "userId",
            onDelete: "cascade",
        });
    };

    return UserLoginHistory;
};
