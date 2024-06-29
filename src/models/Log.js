const { Model, DataTypes } = require('sequelize')

class Log extends Model {
  static init(sequelize) {
    super.init({
      action: DataTypes.STRING,
      details: DataTypes.JSON,
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

module.exports = Log;
