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
  }
}
