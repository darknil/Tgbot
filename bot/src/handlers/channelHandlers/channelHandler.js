import { UserService } from '../../../../server/src/services/user.service.js'
export class ChannelHandler {
  constructor(bot) {
    this.bot = bot
    this.UserService = new UserService()
    this.bot.on('new_chat_members', this.handleUserJoin.bind(this))
  }
  async handleUserJoin(msg) {
    try {
      console.log('msg chat:', msg.chat.id)
      if (msg.new_chat_members != undefined) {
        console.log('new member :', msg.new_chat_members)
        const newMember = msg.new_chat_members[0]
        this.bot.sendMessage(
          msg.chat.id,
          `Welcome to the channel ${newMember.first_name} ${newMember.last_name}`
        )
      }
    } catch (error) {
      console.log('handle user start error', error)
    }
  }
}
