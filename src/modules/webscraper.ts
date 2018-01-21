import Module from './base'
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

class WebScraper extends Module {
    static type = 'WebScraper'

    constructor(name: string, public config: WebScraperConfig) {
        super(name + 'WebScraper')
        this.config = config
    }

    private async getPage(url: string) {
        return Promise.resolve('_hello_')
        // const page = await fetch(url)
        // return page.text()
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

export default WebScraper
