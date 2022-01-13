import {Username} from './modules/username.js'
import {Socket} from './modules/socket.js'
import {Messages} from './modules/messages.js'
import {TypingStatus} from './modules/typingStatus.js'
import {MessageForm} from './modules/messageForm.js'
import {RoomForm} from './modules/roomForm.js'
import {Rooms} from './modules/rooms.js'

document.addEventListener('DOMContentLoaded', () => {
    const username = new Username('#username')
    const messages = new Messages('#messages')
    const messageForm = new MessageForm('#messageForm')
    const typingStatus = new TypingStatus('#typingStatus')
    const roomForm = new RoomForm('#room')
    const rooms = new Rooms('#rooms')
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

    socket.onUserTyping(payload => {
        console.log(payload)
        typingStatus.addTypingUser(payload.username)
    })

    messageForm.onSubmit(value => {
        socket.emitChatMessage(value)
    })

    messageForm.onKeypress(() => {
        socket.emitUserTyping()
    })

    rooms.render()

    roomForm.onSubmit(room => {
        socket.emitRoomChange(room)
    })

    socket.onRoomChanged(room => {
        rooms.add(room)
        rooms.select(room)
        rooms.render()
        messages.clear()
    })
})
