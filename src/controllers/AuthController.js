const User = require('../models/User');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

module.exports = {
  async store(req, res) {
    const { email, password } = req.body;

    const userEmailAlreadyExists = await User.findOne({ where: { email } });
    if (!userEmailAlreadyExists) {
      return res.status(400).json({ error: 'User email does not exists' });
    }

    const comparePassword = await bcrypt.compare(password, userEmailAlreadyExists.password);
    if (!comparePassword) {
      return res.status(400).json({ error: 'Password does not match' });
    }

    const token = generateToken({ id: userEmailAlreadyExists.id, email: userEmailAlreadyExists.email });
    if (!token) {
      return res.status(500).json({ error: 'Error generating token' });
    }

    res.json({
      user: {
        id: userEmailAlreadyExists.id,
        name: userEmailAlreadyExists.name,
        email: userEmailAlreadyExists.email,
      },
      token
    })
  }
}