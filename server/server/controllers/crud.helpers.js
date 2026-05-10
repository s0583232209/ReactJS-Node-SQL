import log from "../utils/logger.js";
import {
  sendServerError,
  sendNotFound,
  sendDeleteSuccess,
  sendBadRequest,
} from "../utils/response.js";

export function makeDeleteHandler(DAL_delete, entity) {
  return async function (req, res) {
    try {
      log.info(
        `${entity} delete called for id: ${req.params.id}, user: ${req.user?.userId}`,
      );
      const { id } = req.params;
      const deleted = await DAL_delete(id, req.user.userId);
      if (!deleted) {
        log.warn(
          `${entity} delete - not found or unauthorized: id ${id}, user ${req.user?.userId}`,
        );
        return sendNotFound(res, `${entity} not found`);
      }
      log.info(
        `${entity} delete successful for id: ${id}, user: ${req.user?.userId}`,
      );
      return sendDeleteSuccess(res, entity, id);
    } catch (err) {
      log.error(`${entity} delete error: ${err.message}`);
      sendServerError(res, `Failed to delete ${entity.toLowerCase()}`, err);
    }
  };
}

export function makeUpdateHandler(DAL_update, entity, extractBody) {
  return async function (req, res) {
    try {
      log.info(
        `${entity} update called for id: ${req.params.id}, user: ${req.user?.userId}`,
      );
      const { id } = req.params;
      const updated = await DAL_update(
        id,
        extractBody(req.body),
        req.user.userId,
      );
      if (!updated) {
        log.warn(
          `${entity} update - not found or unauthorized: id ${id}, user ${req.user?.userId}`,
        );
        return sendNotFound(res, `${entity} not found`);
      }
      log.info(
        `${entity} update successful for id: ${id}, user: ${req.user?.userId}`,
      );
      res.status(200).json(updated);
    } catch (err) {
      log.error(`${entity} update error: ${err.message}`);
      sendServerError(res, `Failed to update ${entity.toLowerCase()}`, err);
    }
  };
}

export function makeCreateHandler(DAL_create, entity, validate) {
  return async function (req, res) {
    try {
      log.info(`${entity} create called`);
      const validationError = validate(req.body);
      if (validationError) {
        log.warn(`${entity} create missing required fields`);
        return sendBadRequest(res, validationError);
      }
      const newItem = await DAL_create(req);
      log.info(`${entity} create successful, id: ${newItem.id}`);
      res.status(201).json(newItem);
    } catch (err) {
      log.error(`${entity} create error: ${err.message}`);
      sendServerError(res, `Failed to create ${entity.toLowerCase()}`, err);
    }
  };
}
