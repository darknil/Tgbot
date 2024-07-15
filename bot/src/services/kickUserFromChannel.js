import 'dotenv/config'
export class KickUserFromChannel {
  constructor(bot) {
    this.bot = bot
    this.channelId = process.env.TG_CHANNEL
  }
  async banUser(chatId) {
    try {
      await this.bot.banChatMember(this.channelId, 7287098100)
      console.log(`User with ID ${chatId} has been kicked from the channel.`)
    } catch (error) {
      console.error(`Error kicking user: ${error.message}`)
    }
  }
  async kickUser(userID) {
    try {
      const chatId = -1002216802473
      this.bot.kickChatMember(chatId, userId, {
        until_date: Date.now() + ms('7 days')
      })
    } catch (error) {
      console.log('kick user from chat error :', error)
    }
  }
}
