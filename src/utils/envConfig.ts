import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT;
const connectionString = process.env.CONNECTION_STRING;

export { port, connectionString };
