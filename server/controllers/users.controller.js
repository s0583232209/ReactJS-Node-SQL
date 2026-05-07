import * as usersService from "../services/users.service.js";
import log from "../utils/logger.js";

export async function getById(req, res) {
  try {
    const user = await usersService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    log.warn(`getById error: ${err.message}`);
    res.status(404).json({ message: "User not found" });
  }
}

export async function updateProfile(req, res) {
  try {
    const user = await usersService.updateProfile(req.params.id, req.body);
    res.status(200).json(user);
  } catch (err) {
    log.warn(`updateProfile error: ${err.message}`);
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
}

export async function updateCredentials(req, res) {
  try {
    const user = await usersService.updateCredentials(req.params.id, req.body);
    res.status(200).json(user);
  } catch (err) {
    log.warn(`updateCredentials error: ${err.message}`);
    res.status(err.status || 500).json({ message: err.message });
  }
}
