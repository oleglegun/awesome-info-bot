import Module from './modules/base'



class App {
    public modules: Modules

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

export { App }
