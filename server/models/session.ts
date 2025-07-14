import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";

// Define TypeScript types for Session attributes
interface SessionAttributes {
  id?: number;
  title: string;
  videoUrl: string;
  isLive: boolean;
  startedAt?: Date;
}

// Optional fields for creation
interface SessionCreationAttributes extends Optional<SessionAttributes, "id" | "isLive" | "startedAt"> {}

class Session extends Model<SessionAttributes, SessionCreationAttributes> implements SessionAttributes {
  public id!: number;
  public title!: string;
  public videoUrl!: string;
  public isLive!: boolean;
  public startedAt!: Date;
}

Session.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isLive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    startedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Session",
  }
);

export default Session;
