import {Username} from './modules/username.js'
import {Socket} from './modules/socket.js'
import {Messages} from './modules/messages.js'
import {MessageForm} from './modules/messageForm.js'
import {TypingStatus} from './modules/typingStatus.js'

document.addEventListener('DOMContentLoaded', () => {
    const username = new Username('#username')
    const messages = new Messages('#messages')
    const messageForm = new MessageForm('#messageForm')
    const typingStatus = new TypingStatus('#typingStatus')
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
        typingStatus.removeTypingUser(username)
    })

    socket.onUserTyping(username => {
        typingStatus.addTypingUser(username)
    })

    messageForm.onSubmit(value => {
        socket.emitChatMessage(value)
    })

    messageForm.onKeypress(() => {
        socket.emitUserTyping()
    })
})
