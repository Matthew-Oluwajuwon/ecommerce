import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT;
const connectionString = process.env.CONNECTION_STRING;
const secretKey = process.env.SECRET_KEY

export { port, connectionString, secretKey };
