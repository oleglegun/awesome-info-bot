import * as TelegramBot from 'node-telegram-bot-api'
import * as config from 'config'
import { getRates } from './helpers'

const token: string = config.get('apiKey')

const bot = new TelegramBot(token, { polling: true })

bot.onText(/getRates/, msg => {
    const chatId = msg.chat.id
    getRates((resp: string) =>
        bot.sendMessage(chatId, resp, {
            reply_markup: {
                keyboard: [['getRates']],
                resize_keyboard: true,
                force_reply: true,
            },
        })
    )
})

bot.onText(/\/start/, msg => {
    const chatId = msg.chat.id

    bot.sendMessage(chatId, 'Wanna check ruble rates? Ok.', {
        reply_markup: {
            keyboard: [['getRates']],
            resize_keyboard: true,
            force_reply: true,
        },
    })
})
