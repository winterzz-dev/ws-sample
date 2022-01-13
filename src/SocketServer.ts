import { Server as socketServer, Socket } from 'socket.io'
import { Server as httpServer } from 'http'
import Moniker from 'moniker'

import { WS_ACTIONS } from './constants'

interface ISocketServer {
    socketServer: typeof socketServer
    httpServer: httpServer
}

type ExtendedSocket = Socket & {
    username: string
}

class SocketServer {
    private io: socketServer

    constructor({socketServer, httpServer}: ISocketServer) {
        this.io = new socketServer(httpServer)
    }

    private onConnectionHandler(socket: ExtendedSocket): void {
        socket.username = Moniker.choose()
        socket.emit(WS_ACTIONS.SET_USERNAME, {
            username: socket.username
        })
    }

    public run(): void {
        this.io.on('connection', this.onConnectionHandler)
    }
}

export default SocketServer