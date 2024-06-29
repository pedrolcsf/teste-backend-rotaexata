const User = require('../models/User');

module.exports = {
  async store(req, res) {
    const { name, email, password } = req.body;

    const userEmailAlreadyExists = await User.findOne({ where: { email } });
    if (userEmailAlreadyExists) {
      return res.status(400).json({ error: 'User email already exists' });
    }

    const user = await User.create({ name, email, password });

    return res.json(user);
  }
}