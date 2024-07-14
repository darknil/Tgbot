import { UserService } from '../../../../server/src/services/user.service.js'
export class ChannelHandler {
  constructor(bot) {
    this.bot = bot
    this.UserService = new UserService()
    this.bot.on('new_chat_members', this.handleUserJoin.bind(this))
  }
  async handleUserJoin(msg) {
    try {
      if (msg.new_chat_members) {
        const newMember = msg.new_chat_members[0]; // Предполагаем, что новый участник - первый в списке
        if (newMember.is_bot) {
          // Проверяем, что добавленный участник - бот
          console.log('msg :',msg)
          const channelId = msg.chat.id;
          const inline_keyboard = {
            inline_keyboard: [
              [
                {
                  text: 'да',
                  callback_data: `addChannel.${channelId}`,
                },
                {
                  text: 'нет',
                }
              ],
            ],
          };
          const admins = await this.UserService.getAdmins()
          for (let admin of admins) {
            console.log('admin', admin)
            await this.bot.sendMessage(admin.chatId, 'Бот был добавлен в канал', {
              reply_markup: inline_keyboard,
            });
          }
          // Здесь можно добавить логику для обработки добавления бота в канал
        }
      }
    } catch (error) {
      console.error('Ошибка обработки добавления бота:', error);
    }
  }
}
