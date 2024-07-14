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
      const admin = isAdmin(decoded.user.chatId)
      if(!admin) {
        return this.ResponseService.unauthorized(res, 'Unauthorized')
      }
      const users = await this.UserService.getUsers()
      const membersPromises = users.map(async (user) => {
        if (user.status) {
          const userStatus = await this.StatusService.getStatusByUuid(user.status);
          console.log('username:', user.username, 'userStatus:', userStatus.value);
            return user;
        } 
      });
      const membersResults = await Promise.all(membersPromises);
      const filteredMembers = membersResults.filter(user => user !== undefined);
      return this.ResponseService.success(res, filteredMembers);
    } catch (error) {
      console.log('get members error', error)
      return this.ResponseService.error(res, 'Error getting members')
    }
  }
}
