import { getConnection } from "../db/connection.js";
import log from "../utils/logger.js";

export async function queryById(table, id, entity) {
  const connection = await getConnection();
  const [rows] = await connection.execute(
    `SELECT * FROM ${table} WHERE id = ?;`,
    [id],
  );
  if (!rows[0]) throw new Error(`${entity} not found`);
  return rows[0];
}

export async function executeDelete(table, id, userId) {
  const connection = await getConnection();
  log.info(`executeDelete - table: ${table}, id: ${id}, userId: ${userId}`);
  const [result] = await connection.execute(
    `DELETE FROM ${table} WHERE id = ? AND user_id =?;`,
    [id, userId],
  );
  const success = result.affectedRows > 0;
  log.info(
    `executeDelete - ${success ? "successful" : "failed - row not found or unauthorized"}, affectedRows: ${result.affectedRows}`,
  );
  return success;
}

export function makeGetById(table, entity) {
  return async function (id) {
    try {
      log.info(`getById ${table} called with id: ${id}`);
      const item = await queryById(table, id, entity);
      log.info(`getById ${table} successful for id: ${id}`);
      return item;
    } catch (err) {
      log.error(`getById ${table} error: ${err.message}`);
      throw err;
    }
  };
}

export function makeDelete(table) {
  return async function (id, userId) {
    try {
      log.info(`delete ${table} called for id: ${id}`);
      const deleted = await executeDelete(table, id, userId);
      log.info(
        `delete ${table} ${deleted ? "successful" : "failed"} for id: ${id}`,
      );
      return deleted;
    } catch (err) {
      log.error(`delete ${table} error: ${err.message}`);
      throw err;
    }
  };
}

export function makeUpdate(table, columns, getById) {
  return async function (id, details, userId) {
    const setClauses = columns.map((col) => `${col} = ?`).join(", ");
    const sql = `UPDATE ${table} SET ${setClauses} WHERE id = ? AND user_id = ?;`;

    try {
      log.info(`update ${table} called for id: ${id}, userId: ${userId}`);
      const connection = await getConnection();
      const params = columns.map((col) => details[col]);
      const result = await connection.execute(sql, [...params, id, userId]);
      if (result[0].affectedRows === 0) {
        log.warn(
          `update ${table} - no rows affected (not found or unauthorized) for id: ${id}, userId: ${userId}`,
        );
        throw new Error(`${table} not found or unauthorized`);
      }
      log.info(`update ${table} successful for id: ${id}, userId: ${userId}`);
      return getById(id);
    } catch (err) {
      log.error(`update ${table} error: ${err.message}`);
      throw err;
    }
  };
}
