import fetch from 'node-fetch'
import * as Mustache from 'mustache'

interface WebScraperConfig {
    url: string
    regex: WebScraperConfigRegex
    template: string
}

interface WebScraperConfigRegex {
    [name: string]: RegExp
}

interface MustacheValues {
    [name: string]: string
}
/*
 *  Classes
 */

abstract class Module {
    abstract config: any

    constructor(public name: string) {
        this.name = name
    }

    abstract async render(): Promise<string>
}

/*
 *  WebScraper
 */

class WebScraper extends Module {
    static type = 'WebScraper'

    constructor(name: string, public config: WebScraperConfig) {
        super(name + 'WebScraper')
        this.config = config
    }

    private async getPage(url: string) {
        const page = await fetch(url)
        return page.text()
    }

    private parse(text: string, regex: RegExp): string {
        const regexResult = text.match(regex)
        if (regexResult === null) {
            return ''
        }

        return regexResult[1]
    }

    public async render() {
        const page = await this.getPage(this.config.url)

        const values: MustacheValues = {}

        Object.keys(this.config.regex).forEach(name => {
            values[name] = this.parse(page, this.config.regex[name])
        })

        const result = Mustache.render(this.config.template, values)
        return Promise.resolve(result)
    }
}

/**
 * Module Interface
 * new ...module()
 * .render(): string
 */

interface Modules {
    [name: string]: Module
}

class App {
    private modules: Modules

    constructor() {
        this.modules = {}
    }

    add(module: Module) {
        this.modules[module.name] = module
    }

    async run() {
        const promises = Object.keys(this.modules).map((moduleName, index) => {
            return this.modules[moduleName].render()
        })

        const results = await Promise.all(promises)

        return results.join('\n')
    }
}

/*
 *  Client
 */

class Client {
    public active: boolean
    readonly activeModules: string[]
    public nextRunTime: number

    constructor(public chatId: number) {
        this.activeModules = []
        this.chatId = chatId
    }

    addModule(moduleName: string) {
        if (this.activeModules.indexOf(moduleName) !== -1) {
            throw new Error(`attempt to add moduleName that already exists`)
        }
        this.activeModules.push(moduleName)
    }
}

interface Clients {
    [chatId: string]: Client
}

const clients: Clients = {}

// new client comes
const chatId1 = 1

// add new client
if (!clients[chatId1]) {
    const client = new Client(chatId1)
    client.addModule('test1WebScraper')
    clients[chatId1] = client
}

export { Module, WebScraper, App }
