type ApiResponse = {
    base: string
    data: string
    rates: Rates
}

type Rates = {
    [propName: string]: number
}

export {ApiResponse, Rates}