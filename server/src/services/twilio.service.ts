import { config } from "../config";
import twilio from "twilio";

const client = twilio(config.twilio.accountSid, config.twilio.authToken);

export const sendSMS = async (to: string, body: string) => {
  return client.messages.create({
    body,
    from: config.twilio.fromPhoneNumber,
    to,
  });
};
