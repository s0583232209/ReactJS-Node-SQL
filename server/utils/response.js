export function sendServerError(res, message, err) {
  res.status(500).json({ message, error: err.message });
}

export function sendNotFound(res, message) {
  return res.status(404).json({ message });
}

export function sendDeleteSuccess(res, entity, id) {
  return res.status(200).json({ message: `${entity} ${id} deleted successfully` });
}

export function sendBadRequest(res, message) {
  return res.status(400).json({ message });
}
