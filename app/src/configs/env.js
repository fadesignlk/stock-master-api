const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "local")
      .default("development"),
    PORT: Joi.number().default(8000),
    MONGO_URI: Joi.string().required().description("Mongo DB url"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
    CLOUDINARY_NAME: Joi.string().required().description("Cloudinary name"),
    CLOUDINARY_API_KEY: Joi.string()
      .required()
      .description("Cloudinary api key"),
    CLOUDINARY_API_SECRET: Joi.string()
      .required()
      .description("Cloudinary api secret"),
    CLOUDINARY_URL: Joi.string().required().description("Cloudinary url"),
    GMAIL_FROM: Joi.string().required().description("Gmail from"),
    GMAIL_SECRET: Joi.string().required().description("Gmail secret"),
    FRONTEND_URL: Joi.string().default("http://localhost:3000/"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) throw new Error(`Environment validation error: ${error.message}`);

const Env = {
  mongoURI: envVars.MONGO_URI,
  port: envVars.PORT,
  env: envVars.NODE_ENV,
  jwtSecret: envVars.JWT_SECRET,
  cloudinaryName: envVars.CLOUDINARY_NAME,
  cloudinaryApiKey: envVars.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: envVars.CLOUDINARY_API_SECRET,
  cloudinaryUrl: envVars.CLOUDINARY_URL,
  emailFrom: envVars.GMAIL_FROM,
  emailSecret: envVars.GMAIL_SECRET,
  orderServceUrl: envVars.ORDER_SERVICE_URL,
  rabbitmqUrl: envVars.RABBITMQ_URL,
  frontendUrl: envVars.FRONTEND_URL,
};

module.exports = Env;
