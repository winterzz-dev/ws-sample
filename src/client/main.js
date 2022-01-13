import {Username} from './modules/username.js'

document.addEventListener('DOMContentLoaded', () => {
    const username = new Username('#username')
    const WS_ACTIONS = {
        SET_USERNAME: 'SET_USERNAME'
    }

    const socket = io()

    socket.on(WS_ACTIONS.SET_USERNAME, payload => {
        username.render(payload.username)
    })
})
