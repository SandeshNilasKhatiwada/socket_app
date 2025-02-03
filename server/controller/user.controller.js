const { registerUser, loginUser } = require('../services/user.services');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const response = await registerUser(username, email, password);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await loginUser(email, password);
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { register, login };
