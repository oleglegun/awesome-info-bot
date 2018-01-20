"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const url = require("url");
const config = require("config");
const port = config.get('Port');
const baseCurrency = config.get('BaseCurrency');
http
    .createServer((req, res) => {
    if (req.method === 'GET') {
        // remove /
        const pathname = url.parse(req.url).pathname.slice(1);
        const currencies = pathname.length ? pathname.split(',') : 'USD';
    }
    else {
        res.statusCode = 400;
        res.end();
    }
})
    .listen(port);
//# sourceMappingURL=server.js.map