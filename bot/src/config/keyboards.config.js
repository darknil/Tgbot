export const keyboards = {
  startKeyboard: {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Запустить',
            web_app: { url: process.env.DOMAIN }
          }
        ]
      ]
    }
  },
  emailKeyboard: {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Подключить почту',
            callback_data: 'email_connect'
          }
        ]
      ]
    }
  }
}
