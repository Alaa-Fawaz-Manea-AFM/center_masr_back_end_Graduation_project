// import { Center } from "./index.js";
// import { DataTypes } from "sequelize";
// import sequelize from "../config/database.js";
// import { classRoomArray } from "../utils/constant.js";

// // === ClassRoom Model ===
// const ClassRoom = sequelize.define(
//   "classRoom",
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     centerId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: { model: Center, key: "id" },
//       onDelete: "CASCADE",
//     },
//     classRoom: {
//       // type: DataTypes.STRING(),
//       type: DataTypes.ENUM(...classRoomArray),
//       allowNull: false,
//     },
//     studyMaterial: {
//       type: DataTypes.ARRAY(DataTypes.STRING),
//       allowNull: false,
//     },
//   },
//   {
//     // timestamps: true,
//     indexes: [{ unique: true, fields: ["classRoom", "centerId"] }],
//   },
// );

// export default ClassRoom;
