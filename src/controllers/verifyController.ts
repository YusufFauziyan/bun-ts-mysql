import { Request, Response } from "express";
import twilio from "twilio";
import crypto from "crypto";
import { updateVerifiedPhoneNumber } from "../models/userModel";

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER;
const twilioClient = twilio(accountSid, authToken);

// Twilio WhatsApp-enabled number
const twilioWhatsAppNumber = `whatsapp:${twilioNumber}`;

// Temporary storage for verification codes (use a database in production)
const verificationPhoneNumberCodes: { [key: string]: string } = {};
const verificationEmailCodes: { [email: string]: string } = {};

// Generate a random 6-digit verification code
const generateVerificationCode = (): string => {
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // Example: 'A1B2C3'
};

// Controller to send verification code via WhatsApp
export const sendVerificationPhoneNumberCode = async (
  req: Request,
  res: Response
) => {
  const { phoneNumber } = req.body; // Expecting phoneNumber in format: whatsapp:+<country_code><phone_number>

  if (!phoneNumber) {
    res.status(400).json({ message: "Phone number is required" });
    return;
  }

  const verificationCode = generateVerificationCode();
  verificationPhoneNumberCodes[phoneNumber] = verificationCode;

  try {
    // Send WhatsApp message via Twilio
    await twilioClient.messages.create({
      body: `Your verification code is: ${verificationCode}`,
      from: twilioWhatsAppNumber,
      to: `whatsapp:${phoneNumber}`,
    });

    res.status(200).json({ message: "Verification code sent via WhatsApp" });
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    res.status(500).json({ message: "Failed to send verification code" });
  }
};

// Controller to verify the code
export const verifyPhoneNumberCode = async (req: Request, res: Response) => {
  const loggedInUser = (req as any).user;
  const { phoneNumber, code } = req.body;

  if (!phoneNumber || !code) {
    res.status(400).json({ message: "Phone number and code are required" });
    return;
  }

  const storedCode = verificationPhoneNumberCodes[phoneNumber];

  if (storedCode === code) {
    delete verificationPhoneNumberCodes[phoneNumber]; // Remove the code after successful verification
    await updateVerifiedPhoneNumber(loggedInUser.id, phoneNumber, true);

    res.status(200).json({ message: "Verification successful" });
  } else {
    res.status(400).json({ message: "Invalid verification code" });
  }
};
