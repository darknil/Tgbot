import 'dotenv/config'
import logger from '../../../server/src/logger/logger.js'
export class UnbanUserFromChannel {
  constructor(bot) {
    this.bot = bot
    this.chatId = process.env.TG_CHAT_ID
  }
  async unbanUser(userId) {
    try {
      const channelId = process.env.TG_CHANNEL
      await this.bot.unbanChatMember(channelId, userId)
      console.log(`User ${userId} has been unbanned from channel ${channelId}`)
      return true
    } catch (error) {
      console.log('unban user from channel error', error)
      logger.error(error.message)
    }
  }
}
