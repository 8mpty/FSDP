module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define("Admin", {
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        verificationCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    });
    Admin.associate = (models) => {
        Admin.hasMany(models.Announcement, {
            foreignKey: "adminId",
            onDelete: "cascade"
        });
        Admin.hasMany(models.Rewards, {
            foreignKey: "adminId",
            onDelete: "cascade"
        });
    };
    return Admin;
}