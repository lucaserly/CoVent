'use strict';

const models = require('../models');

const unmatch = async (req, res) => {
  const { profileId, givenLikeId } = req.body;


  const profile = await models.profile.findAll({
    where: { id: profileId },
    include: [
      {
        model: models.profile, as: 'likedProfile',
        attributes: ['id', 'picture', 'age', 'gender', 'location', 'userId'],
        include: {
          attributes: ['id', 'firstName', 'lastName', 'email'],
          model: models.user,
        }
      },
      {
        model: models.profile, as: 'receivedLike',
        attributes: ['id', 'picture', 'age', 'gender', 'location', 'userId'],
        include: {
          model: models.user,
          attributes: ['id', 'firstName', 'lastName', 'email'],
        }
      },
      {
        model: models.profile, as: 'matched',
        attributes: ['id', 'picture', 'age', 'gender', 'location', 'userId'],
        include: {
          model: models.user,
          attributes: ['id', 'firstName', 'lastName', 'email'],
        }
      }
    ]
  });

  const targetProfile = await models.profile.findAll({
    where: { id: givenLikeId },
    include: [
      { model: models.user },
      {
        model: models.profile, as: 'likedProfile',
        attributes: ['id', 'picture', 'age', 'gender', 'location', 'userId'],
        include: {
          attributes: ['id', 'firstName', 'lastName', 'email'],
          model: models.user,
        }
      },
      {
        model: models.profile, as: 'receivedLike',
        attributes: ['id', 'picture', 'age', 'gender', 'location', 'userId'],
        include: {
          model: models.user,
          attributes: ['id', 'firstName', 'lastName', 'email'],
        }
      },
      {
        model: models.profile, as: 'matched',
        attributes: ['id', 'picture', 'age', 'gender', 'location', 'userId'],
        include: {
          model: models.user,
          attributes: ['id', 'firstName', 'lastName', 'email'],
        }
      }
    ]
  });


  // checks before unmatching
  // 1 if profile exists
  if (profile.length === 0) {
    return res.status(500).send({ error: '500', message: 'Profile not available' });
  }
  // 2 if targetprofile exists
  if (targetProfile.length === 0) {
    return res.status(500).send({ error: '500', message: 'Target profile not available' });
  }
  // 3 if targetid is in my likes array
  if (profile[0].dataValues.likedProfile.length > 0) {
    console.log('INSIDE 3 CHECK-->');
    const check = profile[0].dataValues.likedProfile.some((el) => {
      return el.dataValues.id === givenLikeId;
    });
    if (!check) {
      return res.status(500).send({ error: '500', message: 'Target profile not part of my likes so cannot unmatch' });
    }
  } else {
    return res.status(500).send({ error: '500', message: 'Target profile not part of my likes so cannot unmatch' });
  }
  // 4 if my id is in target's receivedlikes array
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
  // 5 if match exists in profile array
  if (profile[0].dataValues.matched.length > 0) {
    const check = profile[0].dataValues.matched.some((el) => {
      return el.dataValues.id === givenLikeId;
    });
    if (!check) {
      return res.status(500).send({ error: '500', message: 'Match is not available in my matched' });
    }
  }
  // 6 if match exists in target's array
  if (targetProfile[0].dataValues.matched.length > 0) {
    const check = targetProfile[0].dataValues.matched.some((el) => {
      return el.dataValues.id === profileId;
    });
    if (!check) {
      return res.status(500).send({ error: '500', message: 'Match is not available in targets array' });
    }
  }
  // 7 you cannot unmatch yourself
  if (profileId === givenLikeId) {
    return res.status(500).send({ error: '500', message: 'You cannot like yourself' });
  }

  // when I unmatch I should
  // 1 -> remove the target profile from my likes and
  await profile[0].removeLikedProfile(givenLikeId, profileId);
  // 2 -> remove it from the target's received likes
  await targetProfile[0].removeReceivedLike(profileId, givenLikeId);
  // 3 -> remove the match from my matched array
  await profile[0].removeMatched(givenLikeId, profileId);
  // 4 -> remove the match from the target's matched array
  await targetProfile[0].removeMatched(profileId, givenLikeId);

  // res.send({ message: 'Unmatched' });

  const updatedProfile = await models.profile.findAll({
    where: { id: profileId },
    include: [
      { model: models.user },
      {
        model: models.profile, as: 'likedProfile',
        attributes: ['id', 'picture', 'age', 'gender', 'location', 'userId'],
        include: {
          attributes: ['id', 'firstName', 'lastName', 'email'],
          model: models.user,
        }
      },
      {
        model: models.profile, as: 'receivedLike',
        attributes: ['id', 'picture', 'age', 'gender', 'location', 'userId'],
        include: {
          model: models.user,
          attributes: ['id', 'firstName', 'lastName', 'email'],
        }
      },
      {
        model: models.profile, as: 'matched',
        attributes: ['id', 'picture', 'age', 'gender', 'location', 'userId'],
        include: {
          model: models.user,
          attributes: ['id', 'firstName', 'lastName', 'email'],
        }
      }
    ]
  });
  res.send(updatedProfile);

};

module.exports = { unmatch };