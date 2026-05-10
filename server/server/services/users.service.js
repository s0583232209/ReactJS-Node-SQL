import bcrypt from "bcrypt";
import * as usersRepo from "../repositories/users.repository.js";

export async function getUserById(id) {
  const user = await usersRepo.getById(id);
  if (!user) throw new Error("User not found");
  return user;
}

export async function updateProfile(id, details) {
  await usersRepo.updateProfile(id, details);
  const user = await usersRepo.getById(id);
  delete user.password;
  return user;
}

export async function updateCredentials(id, { currentPassword, newUsername, newPassword }) {
  const { hashedPassword } = await usersRepo.getPasswordByUserId(id);
  const isMatch = await bcrypt.compare(currentPassword, hashedPassword);
  if (!isMatch) {
    const err = new Error("Incorrect current password");
    err.status = 400;
    throw err;
  }

  if (newUsername) await usersRepo.updateUsername(id, newUsername);

  if (newPassword) {
    const allPasswords = await usersRepo.getAllPasswordsByUserId(id);
    const comparisons = await Promise.all(
      allPasswords.map(({ hashedPassword: h }) => bcrypt.compare(newPassword, h))
    );
    if (comparisons.some(m => m)) {
      const err = new Error("New password cannot be a previously used password");
      err.status = 400;
      throw err;
    }
    const hashed = await bcrypt.hash(newPassword, 12);
    await usersRepo.updatePassword(id, hashed);
  }

  const user = await usersRepo.getById(id);
  delete user.password;
  return user;
}
