'use strict';

const models = require('../models');
const helperFuncs = require('./../utils/helperFuncs');

const createUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await models.user.findAll({
    where: { email: email }
  });
  if (user.length !== 0)
    return res
      .status(409)
      .send({ error: '409', message: 'User already exists' });
  try {
    if (password === '') throw new Error();
    const newUser = {
      ...req.body,
      password: password,
    };
    const user = await models.user.create(newUser);
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send({ error, message: 'Could not create user' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await helperFuncs.findAllUsers(models);
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ error, message: 'Could not get all users' });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await helperFuncs.findUser(models, id);
    if (user.length > 0) {
      res.status(200).send(user);
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(500).send({ error, message: 'Could not get User' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await models.user.findOne({ where: { email: email } });
    const validatedPass = user.password === password ? true : false;
    if (!validatedPass) throw new Error();
    res.status(200).send(user);
  } catch (error) {
    res
      .status(401)
      .send({ error: '401', message: 'Username or password is incorrect' });
  }
};

module.exports = { createUser, getAllUsers, getUser, login };