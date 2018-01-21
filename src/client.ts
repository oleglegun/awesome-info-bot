import { bot } from './bot'
import {
    SendMessageOptions,
    SendBasicOptions,
    InlineKeyboardMarkup,
    ReplyKeyboardMarkup,
    ForceReply,
    ReplyKeyboardRemove,
} from 'node-telegram-bot-api'
import { Modules } from './types'

class Client {
    public active: boolean
    readonly activeModules: string[]
    public nextRunTime: number
    private timer: NodeJS.Timer
    private modules: Modules
    interval: number

    constructor(public chatId: number, modules: Modules) {
        this.activeModules = []
        this.modules = modules
        this.chatId = chatId
    }

    start() {
        console.log('---', 'starting')
        if (this.active) {
            throw new Error('attempt to activate already active client')
        }
        this.active = true

        if (this.timer) {
            throw new Error('timer is already set')
        }

        // demo run
        this.run().then(() => {
            this.sendMessage('Next time:')
        })

        // set next run
        if (!this.interval) {
            throw new Error('interval not set')
        }

        this.timer = setInterval(this.run, this.interval)
    }

    stop() {
        clearInterval(this.timer)
        this.active = false
    }

    // run runs all active modules' render() functions and sends concatenated message the the client
    async run() {
        console.log('---', 'running')

        const promises = Object.keys(this.modules).map((moduleName, index) => {
            if (this.activeModules.indexOf(moduleName) === -1) {
                // Module is not active
                return Promise.resolve('')
            }
            return this.modules[moduleName].render()
        })
        // wait for results
        const results = await Promise.all(promises)

        const ok = await this.sendMessage(results.join('\n'))
    }

    addModule(moduleName: string) {
        if (this.activeModules.indexOf(moduleName) !== -1) {
            throw new Error(`attempt to add moduleName that already exists`)
        }

        // verify module name
        if (Object.keys(this.modules).indexOf(moduleName) === -1) {
            throw new Error('attempt to add moduleName that does not exist in modules')
        }

        this.activeModules.push(moduleName)
    }

    removeModule(moduleName: string) {
        const moduleIndex = this.activeModules.indexOf(moduleName)

        if (moduleIndex === -1) {
            throw new Error('attempt to remove moduleName that does not exist in activeModules')
        }
        this.activeModules.splice(moduleIndex, 1)
    }

    // sendMessage sends message to the client
    sendMessage(
        msg: string,
        replyMarkup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
    ) {
        if (replyMarkup) {
            bot.sendMessage(this.chatId, msg, { reply_markup: replyMarkup })
        } else {
            bot.sendMessage(this.chatId, msg)
        }
    }
}

export { Client }
