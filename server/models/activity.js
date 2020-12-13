'use strict';

module.exports = (sequelize, DataTypes) => {
  const activity = sequelize.define('activity', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  activity.associate = model => {
    activity.belongsTo(model.category);

  };

  return activity;
};