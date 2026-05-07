import { getConnection } from "../db/connection.js";
import log from "../utils/logger.js";

export async function getRefreshToken(userId) {
  try {
    log.info(`getRefreshToken called for userId: ${userId}`);
    const connection = await getConnection();
    const [rows] = await connection.execute("SELECT refresh_token FROM users WHERE id = ?", [userId]);
    return rows[0];
  } catch (err) {
    log.error(`getRefreshToken error: ${err.message}`);
    throw err;
  }
}
