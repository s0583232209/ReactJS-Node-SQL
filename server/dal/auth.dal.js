import { getConnection } from "./db.connection.js";
import log from "../utils/logger.js";

export async function DAL_refreshToken(userId) {
  try {
    log.info(`DAL_refreshToken called for userId: ${userId}`);
    const connection = await getConnection();
    const [rows] = await connection.execute(
      "SELECT token_hash AS refreshToken,revoked FROM  tokens WHERE user_id = ? AND expires_at > NOW();",
      [userId],
    );
    return rows[0];
  } catch (error) {
    console.error("Error in DAL_refreshToken:", error);
    throw error;
  }
}
export async function addTokenToDd(hashedToken, userId) {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      "INSERT INTO tokens (user_id,token_hash,expires_at) VALUES (?,?, DATE_ADD(NOW(), INTERVAL 7 DAY));",
      [userId, hashedToken],
    );
    return true;
  } catch (err) {
    console.error("Error in addTokenToDd:", err);
    return false;
  }
}
