import Module from './modules/base'

function memoize(module: Module, cacheExpirationTime: number) {
    let renderResult: string
    let calledTime: number

    const render = module.render.bind(module)

    module.render = async () => {
        if (!calledTime || calledTime + cacheExpirationTime - Date.now() < 0) {
            // if this is the first render() call or cache is expired
            calledTime = Date.now()

            renderResult = await render()

            return Promise.resolve(renderResult)
        }

        // return cached result
        return Promise.resolve(renderResult)
    }

    return module
}