import { App } from './app'
import { Client } from './client'
import WebScraper from './modules/webscraper'
import { setTimeout } from 'timers'

interface Clients {
    [chatId: string]: Client
}

/**
 * Initialize app
 */
const app = new App()

/**
 * Initialize modules
 */

const ws1 = new WebScraper('test1', {
    url: '',
    regex: { $1: /f/ },
    template: 'sadf ',
})

const ws2 = new WebScraper('test2', {
    url: '',
    regex: { $1: /f/ },
    template: 'sadf ',
})

/**
 * Add modules to app
 */

app.add(ws1)
app.add(ws2)

console.log('---', app.modules)

/**
 * Add client
 */
const clients: Clients = {}

// new client comes /start
const chatId1 = 1

// add new client
if (!clients[chatId1]) {
    const client = new Client(chatId1, app.modules)

    clients[chatId1] = client
}

console.log('---', clients)

// add modules
clients[chatId1].addModule('test1WebScraper')

console.log('---', clients)

// set interval 1sec
clients[chatId1].interval = 1000

// if /start
clients[chatId1].start()

// if /stop
setTimeout(() => {
    clients[chatId1].stop()
}, 5000)
