import 'dotenv/config'
export class KickUserFromChannel {
  constructor(bot) {
    this.bot = bot
    this.channelId = process.env.TG_CHANNEL
  }
  async kickUser(userId) {
    try {
      await this.bot.banChatMember(this.channelId, 7287098100)
      console.log(`User with ID ${userId} has been kicked from the channel.`)
    } catch (error) {
      console.error(`Error kicking user: ${error.message}`)
    }
  }
}
