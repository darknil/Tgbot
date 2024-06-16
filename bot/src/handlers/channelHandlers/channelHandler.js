import { UserService } from '../../../../server/src/services/user.service'
export class ChannelHandler {
  constructor(bot) {
    this.bot = bot
    this.bot.on('new_chat_members', this.handleUserJoin.bind(this))
  }
  async handleUserJoin(msg) {
    try {
      if (msg.new_chat_members != undefined) {
        console.log('new member :', msg.new_chat_members)
        this.bot.sendMessage(msg.chat.id, `Welcome to the channel !`)
      }
    } catch (error) {
      console.log('handle user start error', error)
    }
  }
}
