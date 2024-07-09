import { UserService } from '../services/user.service.js'
import { StatusService } from '../services/status.service.js'
const userService = new UserService()
const statusService = new StatusService()
const allUsers = await userService.getUsers()
const guestStatus = await statusService.getStatus('guest')
const adminStatus = await statusService.getStatus('admin')
const memberStatus = await statusService.getStatus('member')
export async function fillStatus() {
  try {
    for (const user of allUsers) {
      const status = await statusService.getStatus(user.status)
      if (status) {
        continue
      }
      if (user.chatId === 0) {
        await userService.updateUserStatus(user, guestStatus.value)
        continue
      }
      if (user.chatId === 5859777969) {
        await userService.updateUserStatus(user, adminStatus.value)
        continue
      }
      await userService.updateUserStatus(user, memberStatus.value)
      console.log('status filled successfull')
    }
  } catch (error) {
    console.log('fill status error :', error)
  }
}
