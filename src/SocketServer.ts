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
    room: string
}

class SocketServer {
    private io: socketServer

    constructor({socketServer, httpServer}: ISocketServer) {
        this.io = new socketServer(httpServer)
    }

    public run(): void {
        this.io.on('connection', this.onConnectionHandler)
    }

    private onConnectionHandler = (socket: ExtendedSocket): void => {
        socket.username = Moniker.choose()
        socket.room = 'general'

        socket.emit(WS_ACTIONS.SET_USERNAME, {
            username: socket.username
        })
        socket.join('general')

        socket.to(socket.room).emit(WS_ACTIONS.USER_JOINED, {
            username: socket.username
        })

        socket.on('disconnect', () => {
            socket.to(socket.room).emit(WS_ACTIONS.DISCONNECT, {
                username: socket.username
            })
        })

        socket.on(WS_ACTIONS.CHAT_MESSAGE, payload => {
            this.io.to(socket.room).emit(WS_ACTIONS.CHAT_MESSAGE, {
                message: payload.message,
                username: socket.username
            })
        })

        socket.on(WS_ACTIONS.USER_TYPING, () => {
            socket.to(socket.room).emit(WS_ACTIONS.USER_TYPING, {
                username: socket.username
            })
        })

        socket.on(WS_ACTIONS.CHANGE_ROOM, nextRoom => {
            socket.leave(socket.room)
            socket.join(nextRoom)

            socket.to(socket.room).emit(WS_ACTIONS.DISCONNECT, {
                username: socket.username
            })
            socket.to(nextRoom).emit(WS_ACTIONS.USER_JOINED, {
                username: socket.username
            })

            socket.room = nextRoom
            socket.emit(WS_ACTIONS.ROOM_CHANGED, nextRoom)
        })
    }
}

export default SocketServer