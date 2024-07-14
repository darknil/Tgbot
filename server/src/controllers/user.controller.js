import { UserService } from "../services/user.service.js"
import { ResponseService } from "../services/response.service.js"
import { StatusService } from "../services/status.service.js"
import isAdmin from "../../../bot/src/services/isAdmin.js"
import { JwtService } from "../services/jwt.service.js"
export class UserController {
  constructor() {
    this.UserService = new UserService()
    this.ResponseService = new ResponseService()
    this.StatusService = new StatusService()
    this.JwtService = new JwtService()
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
            const userStatus = await this.StatusService.getStatusByUuid(user.status);
            console.log('username:', user.username);
            console.log('userStatus:', userStatus);
            const value = userStatus.value
            console.log('value:', value);
            user.status = value;
            console.log('Updated user:', user);
      
            updatedUsers.push(user);
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
