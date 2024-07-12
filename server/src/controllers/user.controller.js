import { UserService } from "../services/user.service.js"
import { ResponseService } from "../services/response.service.js"
import { StatusService } from "../services/status.service.js"
export class UserController {
  constructor() {
    this.UserService = new UserService()
    this.ResponseService = new ResponseService()
    this.StatusService = new StatusService()
  }
  getMembers = async (req, res) => {
    try {
      const users = await this.UserService.getUsers()
      const membersPromises = users.map(async (user) => {
        if (user.status) {
          const userStatus = await this.StatusService.getStatusByUuid(user.status.toHexString());
          console.log('username:', user.username, 'userStatus:', userStatus.value);
          if (userStatus.value === 'member') {
            
            return user;
          }
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
