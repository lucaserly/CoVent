'use strict';

const models = require('../models');
const helperFuncs = require('./../utils/helperFuncs');

const unmatch = async (req, res) => {
  const { profileId, givenLikeId } = req.body;

  const profile = await helperFuncs.findProfile(models, profileId, 'profile');
  const targetProfile = await helperFuncs.findProfile(models, givenLikeId, 'profile');

  if (profile.length === 0) {
    return res.status(500).send({ error: '500', message: 'Profile not available' });
  }
  if (targetProfile.length === 0) {
    return res.status(500).send({ error: '500', message: 'Target profile not available' });
  }
  if (profile[0].dataValues.likedProfile.length > 0) {
    const check = profile[0].dataValues.likedProfile.some((el) => {
      return el.dataValues.id === givenLikeId;
    });
    if (!check) {
      return res.status(500).send({ error: '500', message: 'Target profile not part of my likes so cannot unmatch' });
    }
  } else {
    return res.status(500).send({ error: '500', message: 'Target profile not part of my likes so cannot unmatch' });
  }
  if (targetProfile[0].dataValues.receivedLike.length > 0) {
    const check = targetProfile[0].dataValues.receivedLike.some((el) => {
      return el.dataValues.id === profileId;
    });
    if (!check) {
      return res.status(500).send({ error: '500', message: 'I am not part of the targets received likes' });
    }
  } else {
    return res.status(500).send({ error: '500', message: 'I am not part of the targets received likes' });
  }
  if (profile[0].dataValues.matched.length > 0) {
    const check = profile[0].dataValues.matched.some((el) => {
      return el.dataValues.id === givenLikeId;
    });

    if (!check) {
      return res.status(500).send({ error: '500', message: 'Match is not available in my matched' });
    }
  }
  if (targetProfile[0].dataValues.matched.length > 0) {
    const check = targetProfile[0].dataValues.matched.some((el) => {
      return el.dataValues.id === profileId;
    });

    if (!check) {
      return res.status(500).send({ error: '500', message: 'Match is not available in targets array' });
    }
  }
  if (profileId === givenLikeId) {
    return res.status(500).send({ error: '500', message: 'You cannot like yourself' });
  }
  await profile[0].removeLikedProfile(givenLikeId, profileId);
  await targetProfile[0].removeReceivedLike(profileId, givenLikeId);
  await profile[0].removeMatched(givenLikeId, profileId);
  await targetProfile[0].removeMatched(profileId, givenLikeId);
  const updatedUser = await helperFuncs.findUser(models, profile[0].dataValues.userId);
  res.send(updatedUser);
};

module.exports = { unmatch };