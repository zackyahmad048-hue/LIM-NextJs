// modules/authentication/application/list-users.ts
import { listUsers as listUsersFromDb } from '../infrastructure/user.repository'

export async function listUsers() {
  return listUsersFromDb()
}
