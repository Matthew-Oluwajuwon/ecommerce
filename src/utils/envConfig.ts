import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT;
const connectionString = process.env.CONNECTION_STRING;
const secretKey = process.env.SECRET_KEY
const emailUser = process.env.EMAIL_USER
const emailPassword = process.env.EMAIL_PASSWORD

export { port, connectionString, secretKey, emailPassword, emailUser };
