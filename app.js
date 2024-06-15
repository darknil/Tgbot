import { TgBot } from "./bot/bot";
import { ExpressServer } from "./server/server";
class App {
    constructor() {
        
    }
    initTelegramBot() {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        this.tgBot = new TgBot(); 
        
    }
}