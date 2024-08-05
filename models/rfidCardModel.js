module.exports = (sequelize, Sequelize) => {
    const rfidCard = sequelize.define(
        "rfidCard",
        {
            TagID: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            TagName: {
                type: Sequelize.STRING(200),
                allowNull: false
            }
        },
        {
            freezeTableName: true
        }
    );
    return rfidCard;
};
