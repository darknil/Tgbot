export const keyboards = {
  startKeyboard: {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'мини приложение',
            web_app: { url: process.env.DOMAIN }
          }
        ]
      ]
    }
  }
}
