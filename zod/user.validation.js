import { z } from "zod";
import { roleSet, classRoomArray, studyMaterialArray } from "../utils/index.js";
import { educationalStageArray } from "../utils/constant.js";

// ===== Lookup Sets =====
const studyMaterialSet = new Set(studyMaterialArray);

const classRoomSet = new Set(classRoomArray);

const educationalStageSet = new Set(educationalStageArray);

// ===== Helper Functions =====
const cleanString = () => z.string().trim();

const newSet = (arr) => [...new Set(arr)];

const egyptPhone = () =>
  cleanString().regex(/^01[0-9]{9}$/, "invalid Egyptian phone number");

const emailString = () =>
  cleanString().toLowerCase().email("invalid email format");

const roleItemSchema = cleanString().superRefine((item, ctx) => {
  if (!roleSet.has(item)) {
    ctx.addIssue({
      message: `Invalid role: ${item}`,
    });
  }
});

const classRoomItemSchema = cleanString()
  .toLowerCase()
  .superRefine((item, ctx) => {
    if (!classRoomSet.has(item)) {
      ctx.addIssue({
        message: `Invalid class room: ${item}`,
      });
    }
  });

const studyMaterialItemSchema = cleanString()
  .toLowerCase()
  .superRefine((item, ctx) => {
    if (!studyMaterialSet.has(item)) {
      ctx.addIssue({
        message: `Invalid study material: ${item}`,
      });
    }
  });

const educationalStageItemSchema = cleanString()
  .toLowerCase()
  .superRefine((item, ctx) => {
    if (!educationalStageSet.has(item)) {
      ctx.addIssue({
        message: `Invalid educational stage: ${item}`,
      });
    }
  });

const studySystemItem = z
  .array(z.enum(["arabic", "english"]))
  .default(["arabic"])
  .transform((arr) => newSet(arr));

const passwordItemSchema = cleanString()
  .min(9, "password must be at least 9 characters")
  .regex(
    /^(?=(?:.*[A-Z]){3,})(?=(?:.*[a-z]){3,})(?=(?:.*\d){3,}).{9,}$/,
    "password must contain at least 3 uppercase, 3 lowercase, and 3 numbers",
  );

const classRoomSchema = z
  .object({
    classRoom: classRoomItemSchema,
    studyMaterial: z
      .array(studyMaterialItemSchema)
      .transform((arr) => newSet(arr)),
  })
  .strip();

// ===== Base Schema =====
const baseSchema = z
  .object({
    name: cleanString().min(3).max(100),
    imageUrl: cleanString().url().optional(),
    email: emailString(),
    password: passwordItemSchema,
    role: roleItemSchema,
    phone: egyptPhone(),
    address: cleanString().min(3).max(100),
  })
  .strip();

// ===== Role-specific Schemas =====
const studentSchema = z
  .object({
    classRoom: classRoomItemSchema,
    educationalStage: educationalStageItemSchema,
  })
  .strip();

const teacherSchema = z
  .object({
    whatsApp: egyptPhone().optional(),
    bio: cleanString().min(3).max(500).optional(),
    studySystem: studySystemItem,
    classRoom: classRoomItemSchema,
    studyMaterial: studyMaterialItemSchema,
    // educationalStage: educationalStageItemSchema,
    educationalQualification: cleanString().optional(),
    experienceYear: z.number().min(0).max(100).optional(),
    sharePrice: z.int().min(0, "share Price must be at least 0"),
  })
  .strip();

const centerSchema = z
  .object({
    whatsApp: egyptPhone().optional(),
    bio: cleanString().min(3).max(500).optional(),
    governorate: cleanString(),
    studySystem: studySystemItem,
    // classRoom: z.array(classRoomSchema).optional(),
    studyMaterial: z
      .array(studyMaterialItemSchema)
      .transform((arr) => newSet(arr)),
    contactUsPhone: z
      .array(egyptPhone())
      .transform((arr) => newSet(arr))
      .optional(),
    educationalStage: z
      .array(educationalStageItemSchema)
      .transform((arr) => newSet(arr)),
    contactUsEmail: z
      .array(emailString())
      .transform((arr) => newSet(arr))
      .optional(),
  })
  .strip();

// ===== Sign Up Schema =====
const signUpSchema = z.discriminatedUnion("role", [
  baseSchema.merge(studentSchema).extend({ role: z.literal("student") }),
  baseSchema.merge(teacherSchema).extend({ role: z.literal("teacher") }),
  baseSchema.merge(centerSchema).extend({ role: z.literal("center") }),
]);

// ===== Update User Schema =====
const baseUpdateSchema = baseSchema
  .omit({
    email: true,
    password: true,
    role: true,
  })
  .partial()
  .strip();

const updateUserSchema = z.discriminatedUnion("role", [
  baseUpdateSchema
    .merge(studentSchema.partial())
    .extend({ role: z.literal("student") }),
  baseUpdateSchema
    .merge(teacherSchema.partial())
    .extend({ role: z.literal("teacher") }),
  baseUpdateSchema
    .merge(centerSchema.partial())
    .extend({ role: z.literal("center") }),
]);

// ===== Sign In Schema =====
const signInSchema = z
  .object({
    email: emailString(),
    password: passwordItemSchema,
  })
  .strip();

// ===== ID Schema =====
const idSchema = z.object({
  id: z.string().uuid("Invalid UUID"),
});

const roleSchema = z
  .object({
    role: roleItemSchema,
  })
  .strip();

const BaseGetAllItems = z
  .object({
    role: roleItemSchema,
    name: cleanString().toLowerCase().optional(),
  })
  .strip();

const TeacherGetAllItems = z
  .object({
    studyMaterial: studyMaterialItemSchema.optional(),
    classRoom: classRoomItemSchema.optional(),
  })
  .strip();

const CenterGetAllItems = z
  .object({
    educationalStage: educationalStageItemSchema.optional(),
    governorate: cleanString().optional(),
  })
  .strip();

const getAllUsersSchema = z.discriminatedUnion("role", [
  BaseGetAllItems.merge(TeacherGetAllItems).extend({
    role: z.literal("teacher"),
  }),
  BaseGetAllItems.merge(CenterGetAllItems).extend({
    role: z.literal("center"),
  }),
]);

// ===== Exports =====
export {
  roleItemSchema,
  signUpSchema,
  classRoomSet,
  signInSchema,
  getAllUsersSchema,
  cleanString,
  roleSchema,
  idSchema,
  studyMaterialSet,
  updateUserSchema,
  classRoomItemSchema,
  studyMaterialItemSchema,
};

// ===== Change Password Schema =====
const changePasswordSchema = z.object({
  oldPassword: passwordItemSchema,
  newPassword: cleanString().regex(
    /^(?=(?:.*[A-Z]){3,})(?=(?:.*[a-z]){3,})(?=(?:.*\d){3,}).{9,}$/,
    "Weak password",
  ),
});
