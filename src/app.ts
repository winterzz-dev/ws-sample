import express from 'express'
import { Server as socketServer } from 'socket.io'

import HttpServer from './HttpServer'
import SocketServer from './SocketServer'

const httpAppServer = new HttpServer({
    httpServer: express,
    port: 3000
})

httpAppServer.run()

const socketIoServer = new SocketServer({
    socketServer: socketServer,
    httpServer: httpAppServer.server
})

socketIoServer.run()