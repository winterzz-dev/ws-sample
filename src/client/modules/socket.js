/* global io */
const WS_ACTIONS = {
    SET_USERNAME: 'SET_USERNAME',
    USER_JOINED: 'USER_JOINED',
    DISCONNECT: 'DISCONNECT'
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
}