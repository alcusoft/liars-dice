import jwt from "jsonwebtoken";
import { type Player } from "../../common/types/game";

/**
 * Signs an authorization token for a specified player.
 * @param playerId The ID of the player.
 * @returns The signed token.
 */
export const signAuthToken = (playerId: Player["id"]) => {
  const secretKey = process.env.SECRET_KEY;

  if (secretKey === undefined) {
    throw new Error("Failed to sign auth token");
  }

  const payload = { sub: playerId };
  return jwt.sign(payload, secretKey);
};

/**
 * Verifies a specified authorization token.
 * @param token The token to verify.
 * @returns The decoded token.
 */
export const verifyAuthToken = (token: string) => {
  const secretKey = process.env.SECRET_KEY;

  if (secretKey === undefined) {
    throw new Error("Failed to verify auth token");
  }

  return jwt.verify(token, secretKey);
};
