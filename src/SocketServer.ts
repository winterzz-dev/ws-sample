import { Server as socketServer } from 'socket.io'
import Moniker from 'moniker'

import {
    ExtendedSocket,
    GENERAL_ROOM,
    IPayloadWithMessage,
    IServer,
    ISocketServer,
    SOCKET_IO_EVENTS,
    WS_ACTIONS
} from './types'

class SocketServer implements IServer {
    private io: socketServer

    constructor({socketServer, httpServer}: ISocketServer) {
        this.io = new socketServer(httpServer)
    }

    public run(): void {
        this.io.on(SOCKET_IO_EVENTS.CONNECTION, this.onConnectionHandler)
    }

    private onUserDisconnected = (socket: ExtendedSocket): void => {
        socket.to(socket.room).emit(WS_ACTIONS.DISCONNECT, {
            username: socket.username
        })
    }

    private onChatMessage = (socket: ExtendedSocket, payload: IPayloadWithMessage) => {
        this.io.to(socket.room).emit(WS_ACTIONS.CHAT_MESSAGE, {
            message: payload.message,
            username: socket.username
        })
    }

    private onUserTyping = (socket: ExtendedSocket) => {
        socket.to(socket.room).emit(WS_ACTIONS.USER_TYPING, {
            username: socket.username
        })
    }

    private onUserChangeRoom = (socket: ExtendedSocket, nextRoom: string) => {
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
    }

    private onConnectionHandler = (socket: ExtendedSocket): void => {
        socket.username = Moniker.choose()
        socket.room = GENERAL_ROOM

        socket.emit(WS_ACTIONS.SET_USERNAME, {
            username: socket.username
        })
        socket.join(GENERAL_ROOM)

        socket.to(socket.room).emit(WS_ACTIONS.USER_JOINED, {
            username: socket.username
        })

        socket.on(SOCKET_IO_EVENTS.DISCONNECT, this.onUserDisconnected.bind(this, socket))

        socket.on(WS_ACTIONS.CHAT_MESSAGE, payload => this.onChatMessage(socket, payload))

        socket.on(WS_ACTIONS.USER_TYPING, this.onUserTyping.bind(this, socket))

        socket.on(WS_ACTIONS.CHANGE_ROOM, nextRoom => this.onUserChangeRoom.call(this, socket, nextRoom))
    }
}

export default SocketServer