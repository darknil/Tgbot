import { UserService } from "../services/user.service.js"
import { ResponseService } from "../services/response.service.js"
import { StatusService } from "../services/status.service.js"
import isAdmin from "../../../bot/src/services/isAdmin.js"
import { JwtService } from "../services/jwt.service.js"
import { ReportService } from "../services/report.service.js"
export class UserController {
  constructor() {
    this.UserService = new UserService()
    this.ResponseService = new ResponseService()
    this.StatusService = new StatusService()
    this.JwtService = new JwtService()
    this.ReportService = new ReportService()
  }
  getMembers = async (req, res) => {
    try {
      const token = req.headers.authorization
      if (!token) {
        return this.ResponseService.unauthorized(res, 'No token provided')
      }
      const decoded = this.JwtService.verifyToken(token)
      if (!decoded) {
        return this.ResponseService.unauthorized(res, 'Invalid token')
      }
      const status = await this.StatusService.getStatusByUuid(decoded.user.status)
      if(status.value!== 'admin') {
        return this.ResponseService.unauthorized(res, 'Unauthorized')
      }
      const users = await this.UserService.getUsers()
      const updatedUsers = [];
      for (let user of users) {
        if (user.status) {
          try {
            const status = await this.StatusService.getStatusByUuid(user.status);
            const hasReport = await this.ReportService.getUserReport(user.chatId);
            const hasUserReport = hasReport && hasReport.length > 0;
            let newUser = {
              id:user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              chatId: user.chatId,
              status: status.value,
              hasReport: hasUserReport
            }
            updatedUsers.push(newUser);
          } catch (error) {
            console.error(`Ошибка при обновлении статуса для пользователя ${user.username}:`, error);
          }
        }
      }
      return this.ResponseService.success(res, updatedUsers);
    } catch (error) {
      console.log('get members error', error)
      return this.ResponseService.error(res, 'Error getting members')
    }
  }
}
