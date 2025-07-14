// server/models/ShopItem.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const ShopItem = sequelize.define("ShopItem", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cost: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = ShopItem;
