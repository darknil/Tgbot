export const keyboards = {
  startKeyboard: {
    reply_markup: {
      keyboard: [
        [
          { text: 'Yes, add this to my profile' },
          { text: 'No, I want to use other data' }
        ]
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  }
}
