const { WebScraper } = require('../dist/app')
const assert = require('assert')

describe('WebScraper tests', () => {
    it('works', async () => {
        const ws = new WebScraper('simple', {
            url: '',
            regex: {
                $1: /_(.+)_/,
                $2: /:(.+):/,
            },
            template: '$1 = {{$1}}, $2 = {{$2}}',
        })
        // mock method
        ws.getPage = () => '_value1_:value2:'

        const result = await ws.render()

        assert.equal(result, '$1 = value1, $2 = value2')
    })
})
