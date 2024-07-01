const { Model, DataTypes } = require('sequelize');
const Log = require('./Log');

class Address extends Model {
  static init(sequelize) {
    super.init({
      zipcode: DataTypes.STRING,
      street: DataTypes.STRING,
      district: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      complement: DataTypes.STRING,
      number: DataTypes.INTEGER,
    }, {
      sequelize,
      hooks: {
        beforeUpdate: async (address, options) => {
          const previousAddress = await Address.findOne({ where: { id: address.id } });
          await Log.create({
            action: 'update',
            details: {
              before: previousAddress.toJSON(),
              after: address.toJSON()
            },
            user_id: address.user_id
          });
        },
        beforeDestroy: async (address, options) => {
          await Log.create({
            action: 'delete',
            details: {
              before: address.toJSON(),
              after: null
            },
            user_id: address.user_id
          });
        }

      }
    })
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

module.exports = Address;
