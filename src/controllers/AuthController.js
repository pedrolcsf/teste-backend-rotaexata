const User = require('../models/User');
const bcrypt = require('bcrypt');

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

    res.json({
      message: 'User logged in successfully'
    })
  }
}