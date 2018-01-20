import * as request from 'request'
import * as util from 'util'
import * as config from 'config'
import { ApiResponse, Rates } from './types'

const baseCurrency: string = config.get('BaseCurrency')

function getRates(send: (msg: string) => void) {
    request(requestURL(baseCurrency, ['USD', 'EUR', 'CNY', 'HKD']), (error, response, body) => {
        if (error) {
            throw new Error(error.toString())
        }

        if (response && response.statusCode === 200) {
            const rates: Rates = {}

            const data: ApiResponse = JSON.parse(body)

            Object.keys(data.rates).forEach(key => {
                rates[key] = calcRates(data.rates[key])
            })

            const botResp = `USD: ${rates.USD.toFixed(2)}  EUR: ${rates.EUR.toFixed(
                2
            )} CNY: ${rates.CNY.toFixed(2)}

iPhone X 64GB Index
US: ${Math.floor(rates.USD * 999)} ₽
DE: ${Math.floor(rates.EUR * 1149 * 0.887)} ₽
HK: ${Math.floor(rates.HKD * 8588)} ₽
CN: ${Math.floor(rates.CNY * 8388)} ₽`
            send(botResp)
        }
    })
}

const requestURL = function(from: string, to: string[]): string {
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

export { getRates }
