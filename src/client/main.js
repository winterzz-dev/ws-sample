import {Username} from './modules/username.js'
import {Socket} from './modules/socket.js'
import {Messages} from './modules/messages.js'
import {MessageForm} from './modules/messageForm.js'

document.addEventListener('DOMContentLoaded', () => {
    const username = new Username('#username')
    const messages = new Messages('#messages')
    const messageForm = new MessageForm('#messageForm')
    const socket = new Socket()

    socket.onSetUsername(payload => {
        username.render(payload.username)
        messages.renderSystemMessage(`${payload.username} assigned to you.`)
    })

    socket.onUserJoined(payload => {
        messages.renderSystemMessage(`${payload.username} joined.`)
    })

    socket.onUserLeft(payload => {
        messages.renderSystemMessage(`${payload.username} left.`)
    })

    socket.onChatMessage(({username, message}) => {
        messages.renderMessage(username, message)
    })

    messageForm.onSubmit(value => {
        socket.emitChatMessage(value)
    })
})
