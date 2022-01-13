export class Messages {
    constructor(selector) {
        this.node = document.querySelector(selector)
    }

    renderMessage = (username, message) => {
        this.node.innerHTML += `<b>[${username}]</b>: ${message}\n`
    }

    renderSystemMessage = message => {
        this.renderMessage('system', message)
    }

    clear = () => {
        this.node.innerHTML = ''
    }
}