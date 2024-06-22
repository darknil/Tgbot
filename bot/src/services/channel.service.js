import 'dotenv/config'
export class ChannelService {
  constructor(bot) {
    this.bot = bot
  }

  async isMember(userChatId) {
    try {
      const ChannelId = process.env.TG_CHANNEL
      const chatMember = await this.bot.getChatMember(ChannelId, userChatId)
      // Check if the user is a member (returns 'member' status)

      return (
        chatMember.status === 'creator' ||
        chatMember.status === 'member' ||
        chatMember.status === 'administrator'
      )
    } catch (error) {
      console.error('Error checking user membership:', error)
      throw error // You may handle errors differently based on your application's needs
    }
  }
  async sendUsersReport(usernames) {
    try {
      const channelId = process.env.TG_CHANNEL
      const caption = `Пользователи, которые не заполнили ежедневный отчёт:`
      const response = await this.bot.sendMessage(channelId, caption)
      console.log('Сообщение успешно отправлено:', response)
    } catch (error) {
      console.log('send user reports')
    }
  }
}
