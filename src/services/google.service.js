import { OAuth2Client } from "google-auth-library";

const googleLogin = async (credential) => {
  try {
    const gClient = new OAuth2Client
    const ticket = await gClient.verifyIdToken({
      idToken: credential,
      audience: "680750957937-jaf902h6hqs2f4cnmbal8k5ie2mjdvg5.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (e) {
    throw new Error(e);
  }
}

export default googleLogin;