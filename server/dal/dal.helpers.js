import { getConnection } from "./db.connection.js";
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

export async function executeDelete(table, id) {
  const connection = await getConnection();
  const [result] = await connection.execute(
    `DELETE FROM ${table} WHERE id = ?;`,
    [id],
  );
  return result.affectedRows > 0;
}

export function makeGetById(table, entity) {
  return async function (id) {
    try {
      log.info(`DAL_getById ${table} called with id: ${id}`);
      const item = await queryById(table, id, entity);
      log.info(`DAL_getById ${table} successful for id: ${id}`);
      return item;
    } catch (err) {
      log.error(`DAL_getById ${table} error: ${err.message}`);
      throw err;
    }
  };
}

export function makeDelete(table) {
  return async function (id) {
    try {
      log.info(`DAL_delete ${table} called for id: ${id}`);
      const deleted = await executeDelete(table, id);
      log.info(`DAL_delete ${table} ${deleted ? "successful" : "failed"} for id: ${id}`);
      return deleted;
    } catch (err) {
      log.error(`DAL_delete ${table} error: ${err.message}`);
      throw err;
    }
  };
}

export function makeUpdate(table, columns, getById) {
  const setClauses = columns.map((col) => `${col} = ?`).join(", ");
  const sql = `UPDATE ${table} SET ${setClauses} WHERE id = ?;`;

  return async function (id, details) {
    try {
      log.info(`DAL_update ${table} called for id: ${id}`);
      const connection = await getConnection();
      const params = columns.map((col) => details[col]);
      await connection.execute(sql, [...params, id]);
      log.info(`DAL_update ${table} successful for id: ${id}`);
      return getById(id);
    } catch (err) {
      log.error(`DAL_update ${table} error: ${err.message}`);
      throw err;
    }
  };
}
