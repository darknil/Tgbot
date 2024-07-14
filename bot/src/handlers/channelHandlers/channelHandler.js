import { UserService } from '../../../../server/src/services/user.service.js'
export class ChannelHandler {
  constructor(bot) {
    this.bot = bot
    this.UserService = new UserService()
    this.bot.on('new_chat_members', this.handleUserJoin.bind(this))
  }
  async handleBotAddedToChannel(msg) {
    try {
      const chat = msg.chat;
      const newChatMember = msg.new_chat_member;
      const status = newChatMember.status;

      // Проверяем, что бот был добавлен в канал
      if (chat.type === 'channel' && status === 'member') {
        const channelId = chat.id; // Получаем идентификатор канала
        const inline_keyboard = {
          inline_keyboard: [
            [
              {
                text: 'Да',
                callback_data: `addChannel.${channelId}`,
              },
              {
                text: 'Нет',
                callback_data: 'doNothing'
              }
            ],
          ],
        };

        const admins = await this.UserService.getAdmins();
        for (let admin of admins) {
          await this.bot.sendMessage(admin.chatId, 'Бот был добавлен в канал', {
            reply_markup: inline_keyboard,
          });
        }
        // Здесь можно добавить логику для обработки добавления бота в канал
      }
    } catch (error) {
      console.error('Ошибка обработки добавления бота в канал:', error);
    }
  }
}
