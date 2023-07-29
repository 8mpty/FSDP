module.exports = (sequelize, DataTypes) => {
    const Announcement = sequelize.define("Announcement", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });
    Announcement.associate = (models) => {
        Announcement.belongsTo(models.Admin, {
            foreignKey: "adminId",
            as: 'admin'
        });
    };
    return Announcement;
}