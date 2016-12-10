/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('order_', {
        order_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        _data: {
            type: DataTypes.JSON,
            allowNull: false
        },
        created: {
            type: DataTypes.DATE,
            allowNull: false
        },
        modified: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'order_'
    });
};
