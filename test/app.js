const { App } = require('../dist/app')
const WebScraper = require('../dist/modules/webscraper')
const assert = require('assert')
require('../dist/init')

describe('Module tests', () => {
    let ws1
    let ws2

    before(() => {
        ws1 = new WebScraper('test1', {
            url: '',
            regex: {
                $1: /_(.+)_/,
                $2: /:(.+):/,
            },
            template: '$1 = {{$1}}, $2 = {{$2}}',
        })

        ws2 = new WebScraper('test2', {
            url: '',
            regex: {
                $1: /_(.+)_/,
                $2: /:(.+):/,
            },
            template: '$1 = {{$1}}, $2 = {{$2}}',
        })

        ws1.getPage = () => '_value1_:value2:'
        ws2.getPage = () => '_value1_:value2:'
    })
    describe('WebScraper tests', () => {
        it('WebScraper works correctly', async () => {
            // mock method

            const result = await ws1.render()

            assert.equal(result, '$1 = value1, $2 = value2')
        })
    })

    describe('App tests', () => {
        it('App works', async () => {
            const app = new App()

            app.add(ws1)
            app.add(ws2)

            const result = await app.run()
            assert.equal(result, '$1 = value1, $2 = value2\n$1 = value1, $2 = value2')
        })
    })
})
