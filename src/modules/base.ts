abstract class Module {
    abstract config: any

    constructor(public name: string) {
        this.name = name
    }

    abstract async render(): Promise<string>
}

export default Module