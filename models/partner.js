/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('partner', {
    partner_id: {
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
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'partner'
  });
};
