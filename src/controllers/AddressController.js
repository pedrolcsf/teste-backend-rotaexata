const Address = require('../models/Address');
const User = require('../models/User');

module.exports = {
    async store(req, res) {
      const userId = req.userId
      const findUser = await User.findByPk(userId);
      if (!findUser) {
        return res.status(400).json({ error: 'User not found' });
      }

      const {
        zipcode,
        street,
        district,
        city,
        state,
        complement,
        number
      } = req.body;

      const address = await Address.create({
        user_id: userId,
        zipcode,
        street,
        district,
        city,
        state,
        complement,
        number
      });

      return res.json(address);
    },
    async index(req, res) {
      const userId = req.userId
      const findUser = await User.findByPk(userId);
      if (!findUser) {
        return res.status(400).json({ error: 'User not found' });
      }

      const findAddress = await Address.findAll({
        where: {
          user_id: userId
        }
      });

      return res.json(findAddress);
    }
}