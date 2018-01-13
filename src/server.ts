import * as http from 'http'
import * as request from 'request'
import * as url from 'url'
import * as config from 'config'
import { ApiResponse, Rates } from './types'

const port: number = config.get('Port')
const baseCurrency: string = config.get('BaseCurrency')

const requestURL = function(from: string, to: string | string[]): string {
    let symbols
    if (typeof to === 'string') {
        symbols = to
    } else if (Array.isArray(to)) {
        symbols = to.join(',')
    }
    return `https://api.fixer.io/latest?base=${from}&symbols=${symbols}`
}

const calcRates = (value: number): number => {
    return 1 / value
}

http
    .createServer((req, res) => {
        if (req.method === 'GET') {
            // remove /
            const pathname = url.parse(req.url).pathname.slice(1)

            const currencies = pathname.length ? pathname.split(',') : 'USD'

            request(requestURL(baseCurrency, currencies), (error, response, body) => {
                if (error) {
                    throw new Error(error.toString())
                }

                if (response && response.statusCode === 200) {
                    const rates: Rates = {}

                    const data: ApiResponse = JSON.parse(body)

                    Object.keys(data.rates).forEach(key => {
                        rates[key] = calcRates(data.rates[key])
                    })

                    const serverResponse = JSON.stringify(rates)

                    res.writeHead(200, { 'Content-Type': 'application/json', Connection: 'close' })
                    res.end(serverResponse)
                }
            })
        } else {
            res.statusCode = 400
            res.end()
        }
    })
    .listen(port)
