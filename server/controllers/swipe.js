'use strict';

const models = require('./../models/');

const addSwipe = async (req, res) => {
  try {
    const newSwipe = await models.swipe.create(req.body);
    res.status(201).send(newSwipe);
  } catch (error) {
    res.status(400).send({ error, message: 'Could not create profile' });
  }
};

module.exports = { addSwipe };