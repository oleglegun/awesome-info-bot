import Module from './modules/base'

type ApiResponse = {
    base: string
    data: string
    rates: Rates
}

type Rates = {
    [propName: string]: number
}

interface Modules {
    [name: string]: Module
}

export { ApiResponse, Rates, Modules }
