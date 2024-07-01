const User = require('../models/User');

const bcrypt = require('bcrypt');

module.exports = {
  async store(req, res) {
    const { name, email, password } = req.body;

    const userEmailAlreadyExists = await User.findOne({ where: { email } });
    if (userEmailAlreadyExists) {
      return res.status(400).json({ error: 'User email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    return res.json(user);
  }
}