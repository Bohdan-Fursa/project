const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('./user')
const auth_router = express.Router();

const secret_key = crypto.randomBytes(32).toString('hex');

const verify_token = (requiredRole) => (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).send('Неавторизовано');
  }

  jwt.verify(token, secret_key, (err, decoded) => {
    if (err) {
      return res.status(403).send('Нема доступу');
    }
    req.user = decoded;

    if (decoded.role !== requiredRole) {
      return res.status(403).send('Forbidden');
    }

    next();
  });
};

auth_router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Вже існує');
    }

    const newUser = new User({ email, password });
    await newUser.save();

    res.status(201).send('Успішна регістрація');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


auth_router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (!user) {
    return res.status(401).send('Invalid email or password');
  }

  const token = jwt.sign({ email: user.email }, secret_key, { expiresIn: '1h' });

  res.json({ token });
});

auth_router.get('/protected', verify_token('admin'), (req, res) => {
  res.send('Protected data');
});

auth_router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

auth_router.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    await User.findByIdAndDelete(userId);
    res.status(200).send('Успішно видалено');
  } catch (error) {
    console.error(error);
    res.status(500).send('Помилка');
  }
});

module.exports = auth_router;