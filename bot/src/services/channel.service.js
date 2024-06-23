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
  async sendMessageToAdmin(usernames, userscount) {
    try {
      const adminId = process.env.ADMINS
      const channelId = process.env.TG_CHANNEL
      const userMentions = usernames
        .map((username) => `@${username}`)
        .join(', ')
      const subscribersCount = await this.bot.getChatMemberCount(channelId)
      const caption = `Пользователи, которые не заполнили ежедневный отчёт:${userMentions}\nВсего пользователей в боте:${userscount}\nВсего пользователей в канале :${subscribersCount}`
      const response = await this.bot.sendMessage(adminId, caption)
      console.log('Сообщение успешно отправлено:', response)
    } catch (error) {
      console.log('send message to admin error :', error)
    }
  }
  async sendMessageToChannelChat(message) {
    try {
      const chatId = -1002216802473
      this.bot.sendMessage(chatId, message)
    } catch (error) {
      console.log('send message to channel chat error :', error)
    }
  }
  async getChannelUsersCount() {
    try {
      const channelId = process.env.TG_CHANNEL
    } catch (error) {
      console.log('get channel users count error :', error)
    }
  }
  async createInviteLink() {
    try {
    } catch (error) {
      console.log('')
    }
  }
}
