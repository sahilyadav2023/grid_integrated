import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../db";

// Define model types
interface UpcomingSessionAttributes {
  id?: number;
  title: string;
  speaker?: string;
  scheduled_at: Date;
}

interface UpcomingSessionCreationAttributes
  extends Optional<UpcomingSessionAttributes, "id"> {}

class UpcomingSession
  extends Model<UpcomingSessionAttributes, UpcomingSessionCreationAttributes>
  implements UpcomingSessionAttributes {
  public id!: number;
  public title!: string;
  public speaker?: string;
  public scheduled_at!: Date;
}

UpcomingSession.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    speaker: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    scheduled_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "UpcomingSession",
    tableName: "upcoming_session", // must match your PostgreSQL table
    timestamps: false,
  }
);

export default UpcomingSession;
