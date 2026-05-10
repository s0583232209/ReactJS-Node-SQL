import { getConnection } from "../db/connection.js";
import log from "../utils/logger.js";

export async function getTokenByUserId(userId) {
  try {
    log.info(`getTokenByUserId called for userId: ${userId}`);
    const connection = await getConnection();
    const [rows] = await connection.execute(
      "SELECT token_hash AS refreshToken, revoked FROM tokens WHERE user_id = ? AND expires_at > NOW();",
      [userId],
    );
    return rows[0];
  } catch (err) {
    log.error(`getTokenByUserId error: ${err.message}`);
    throw err;
  }
}

export async function addToken(hashedToken, userId) {
  try {
    log.info(`addToken called for userId: ${userId}`);
    const connection = await getConnection();
    const [result] = await connection.execute(
      "INSERT INTO tokens (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY));",
      [userId, hashedToken],
    );
    return result.affectedRows > 0;
  } catch (err) {
    log.error(`addToken error: ${err.message}`);
    throw err;
  }
}
