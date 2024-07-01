const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const Address = require('../models/Address');
const User = require('../models/User');

require('dotenv').config();

const SHARED_SECRET_KEY = process.env.SHARED_SECRET_KEY;

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

    async delete(req, res) {
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

      await findAddress.destroy();

      return res.json();
    },

    async index(req, res) {
      const userId = req.userId
      const findUser = await User.findByPk(userId);
      if (!findUser) {
        return res.status(400).json({ error: 'User not found' });
      }

      const { keyword } = req.query;
      let whereClause = { user_id: userId };

      if (keyword) {
        whereClause = {
          user_id: userId,
          [Op.or]: [
            { zipcode: { [Op.like]: `%${keyword}%` } },
            { street: { [Op.like]: `%${keyword}%` } },
            { district: { [Op.like]: `%${keyword}%` } },
            { city: { [Op.like]: `%${keyword}%` } },
            { state: { [Op.like]: `%${keyword}%` } },
            { complement: { [Op.like]: `%${keyword}%` } },
          ]
        }
      }
      const findAddress = await Address.findAll({ where: whereClause });

      return res.json(findAddress);
    },
    async share(req, res) {
      const address_id = req.params.id;
      const { expiresIn } = req.body;
      const userId = req.userId;
      
      const findUser = await User.findByPk(userId);
      if (!findUser) {
          return res.status(400).json({ error: 'User not found' });
      }

      const findAddress = await Address.findByPk(address_id);
      if (!findAddress) {
          return res.status(400).json({ error: 'Address not found' });
      }

      const token = jwt.sign({ address_id }, SHARED_SECRET_KEY, { expiresIn });
      const sharedUrl = `${req.protocol}://${req.get('host')}/shared/${token}`;

      return res.json({ url: sharedUrl });
  },

  async getSharedAddress(req, res) {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, SHARED_SECRET_KEY);
        const { address_id } = decoded;

        const findAddress = await Address.findByPk(address_id);
        if (!findAddress) {
            return res.status(400).json({ error: 'Address not found' });
        }

        return res.json(findAddress);
    } catch (err) {
        return res.status(400).json({ error: 'Invalid or expired token' });
    }
}
}