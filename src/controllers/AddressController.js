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

    async update(req, res) {
      const address_id = req.params.id;
      const userId = req.userId
      const findUser = await User.findByPk(userId);
      if (!findUser) {
        return res.status(400).json({ error: 'User not found' });
      }

      const findAddress = await Address.findByPk(address_id);
      if (!findAddress) {
        return res.status(400).json({ error: 'Address not found' });
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

      findAddress.zipcode = zipcode;
      findAddress.street = street;
      findAddress.district = district;
      findAddress.city = city;
      findAddress.state = state;
      findAddress.complement = complement;
      findAddress.number = number;

      await findAddress.save();

      return res.json(findAddress);
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