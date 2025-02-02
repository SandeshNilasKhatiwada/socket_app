const authService = require('../services/auth.services');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const response = await authService.registerUser(username, email, password);
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const response = await authService.loginUser(email, password);
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { register, login };
