import 'dotenv/config'
export class TelegramPostService {
  constructor(bot) {
    this.bot = bot
  }
  async sendMessageToChannel(message) {
    try {
      const channelUsername = process.env.TG_CHANNEL
      await this.bot.sendMessage(channelUsername, message)
      console.log('Message sent successfully')
    } catch (err) {
      console.error('Error while sending message:', err)
    }
  }
}
