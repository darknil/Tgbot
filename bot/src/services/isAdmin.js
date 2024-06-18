import dotenv from 'dotenv'
dotenv.config()
const adminChatIds = process.env.ADMINS
  ? process.env.ADMINS.split(',').map((id) => id.trim())
  : []
export default (chatId) => {
  return adminChatIds.includes(String(chatId))
}
