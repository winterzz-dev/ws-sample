import express, { Express } from 'express'
import http, { Server as httpServer } from 'http'

import { IHttpServer, IServer } from './types'

class HttpServer implements IServer {
    public server: httpServer
    private readonly app: Express
    private readonly port: number

    constructor({httpServer, port}: IHttpServer) {
        this.app = httpServer()
        this.port = port
        this.server = new http.Server(this.app)

        this.app.get('/', (req, res) => {
            res.sendFile(__dirname + '/client/index.html')
        })
        this.app.use(express.static(__dirname + '/client'))
    }

    public run(): void {
        this.server.listen(this.port, () => {
            console.log(`Http server listening on port: ${this.port}`)
        })
    }
}

export default HttpServer