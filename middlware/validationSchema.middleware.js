import { schema } from "../zod/index.js";

const validate = (schema, key) => (req, res, next) => {
  const result = schema.safeParse({
    [key]: req[key],
  });

  if (!result.success) {
    return res.status(400).json({
      status: "error",
      errors: result.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  req.validatedData = {
    ...req.validatedData,
    [key]: result.data[key],
  };

  next();
};

const validationSchema = (typeReq, option) =>
  validate(schema(typeReq, option), typeReq);

export default validationSchema;
