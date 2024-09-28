import { emailUser } from "../utils/envConfig";
import { transporter } from "../utils/transporter";

export const sendEmail = async (to: string, subject: string, text: string, html: string) => {
    try {
      const info = await transporter.sendMail({
        from: emailUser,  // Sender address
        to: to,                        // List of receivers (comma-separated)
        subject: subject,              // Subject line
        text: text,                    // Plain text body
        html: html,                    // HTML body (optional)
      });
  
      console.log(`Email sent: ${info.messageId}`);
    } catch (error) {
      console.error(`Error sending email: ${error}`);
    }
  };
  