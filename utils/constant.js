const [body, params, query] = ["body", "params", "query"];

const studyMaterialArray = [
  "science",
  "physics",
  "biology",
  "algebra",
  "statics",
  "history",
  "calculus",
  "dynamics",
  "chemistry",
  "geography",
  "mathematics",
  "solid geometry",
  "social studies",
  "arabic language",
  "english language",
  "philosophy and logic",
  "religious education",
  "physical education",
  "computer science/information technology",
  "information and communication technology (ICT)",
];

const classRoomArray = [
  "first grade elementary",
  "second grade elementary",
  "third grade elementary",
  "fourth grade elementary",
  "fifth grade elementary",
  "sixth grade elementary",
  "first year of secondary",
  "second year of secondary",
  "third year of secondary",
  "first grade high school",
  "second grade high school",
  "third grade figh school",
];

const weekDays = [
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
];

const [ADMIN, TEACHER, STUDENT, CENTER] = [
  "admin",
  "teacher",
  "student",
  "center",
];

const educationalStageArray = ["elementary", "secondary", "university"];

const roleEnum = [STUDENT, TEACHER, CENTER, ADMIN];
const roleSet = new Set(roleEnum);

export {
  body,
  ADMIN,
  query,
  CENTER,
  params,
  roleSet,
  TEACHER,
  STUDENT,
  roleEnum,
  weekDays,
  classRoomArray,
  studyMaterialArray,
  educationalStageArray,
};
