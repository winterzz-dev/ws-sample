/* global io */
const WS_ACTIONS = {
    SET_USERNAME: 'SET_USERNAME',
    USER_JOINED: 'USER_JOINED',
    DISCONNECT: 'DISCONNECT',
    CHAT_MESSAGE: 'CHAT_MESSAGE'
}

export class Socket {
    constructor() {
        this.socket = io()
    }

    onSetUsername = handler => {
        this.socket.on(WS_ACTIONS.SET_USERNAME, handler)
    }

    onUserJoined = handler => {
        this.socket.on(WS_ACTIONS.USER_JOINED, handler)
    }

    onUserLeft = handler => {
        this.socket.on(WS_ACTIONS.DISCONNECT, handler)
    }

    onChatMessage = handler => {
        this.socket.on(WS_ACTIONS.CHAT_MESSAGE, handler)
    }

    emitChatMessage = message => {
        this.socket.emit(WS_ACTIONS.CHAT_MESSAGE, {
            message: message
        })
    }
}