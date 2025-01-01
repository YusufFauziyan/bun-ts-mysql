import { OAuth2Client } from "google-auth-library";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

export const verifyGoogleToken = async (token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error("Invalid Google token");
  }

  return {
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  };
};
