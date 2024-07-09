export class UserController {
  constructor() {}
  async getMembers(req, res) {
    try {
      return this.ResponseService.success(res, members)
    } catch (error) {
      console.log('get members error', error)
      return this.ResponseService.error(res, 'Error getting members')
    }
  }
}
