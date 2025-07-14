import { Sequelize } from "sequelize";

const sequelize = new Sequelize("grid_platform", "postgres", "luffy@Gear2", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

export default sequelize;
