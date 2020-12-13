'use strict';

const models = require('./../models/');
const helperFuncs = require('./../utils/helperFuncs');

const addCity = async (req, res) => {

  const { name, profileId } = req.body;
  const city = await models.city.findAll({
    where: { name: name },
  });

  const profile = await helperFuncs.findProfile(models, profileId, 'profile');

  if (profile.length > 0) {
    if (profile[0].cities) {
      const profileCityCheck = profile[0].cities.some((el) => {
        return el.name === name;
      });
      if (profileCityCheck) {
        return res
          .status(409)
          .send({ error: '409', message: 'City already exists' });
      } else {
        try {
          if (city.length > 0) {
            if (profile[0].cities[0]) {
              await profile[0].removeCity(profile[0].cities[0].dataValues.id, profileId);
            }
            await profile[0].addCity(city);
            res.status(201).send(city[0]);
          } else {
            const newCity = await models.city.create(req.body);
            if (profile[0].cities[0]) {
              await profile[0].removeCity(profile[0].cities[0].dataValues.id, profileId);
            }
            await profile[0].addCity(newCity);
            res.status(201).send(newCity);
          }
        } catch (error) {
          res.status(400).send({ error, message: 'Could not add city' });
        }
      }
    } else {
      try {
        if (city.length > 0) {
          await profile[0].addCity(city);
          res.status(201).send(profile);
        } else {
          const newCity = await models.city.create(req.body);
          await profile[0].addCity(newCity);
          res.status(201).send(newCity);
        }
      } catch (error) {
        res.status(400).send({ error, message: 'Could not add city' });
      }
    }
  } else {
    return res
      .status(500)
      .send({ error: '500', message: 'Profile not available' });
  }
};

const getAllCities = async (req, res) => {
  try {
    const cities = await models.city.findAll({
      include: {
        model: models.profile, include: [{ model: models.user }],
      }
    });
    res.status(200).send(cities);
  } catch (error) {
    res.status(500).send({ error, message: 'Could not get Cities' });
  }
};

const removeCityFromUser = async (req, res) => {
  const { cityId, profileId } = req.body;
  const profile = await helperFuncs.findProfile(models, profileId, 'profile');
  await profile[0].removeCity(cityId, profileId);
  const updatedProf = await helperFuncs.findProfile(models, profileId, 'profile');
  res.send(updatedProf);
};

module.exports = { addCity, getAllCities, removeCityFromUser };