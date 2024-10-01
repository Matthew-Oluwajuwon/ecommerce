import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT;
const connectionString = process.env.CONNECTION_STRING;
const secretKey = process.env.SECRET_KEY;
const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
const paystackApiUrl = process.env.PAYSTACK_API_BASE_URL;
const flutterWaveApiBaseUrl = process.env.FLUTTERWAVE_API_BASE_URL;
const flutterWaveSecretKey = process.env.FLUTTER_WAVE_SECRET_KEY;

export {
  port,
  connectionString,
  secretKey,
  emailPassword,
  emailUser,
  paystackSecretKey,
  paystackApiUrl,
  flutterWaveApiBaseUrl,
  flutterWaveSecretKey
};
