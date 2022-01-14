import express from 'express'
import { Server as socketServer, Socket } from 'socket.io'
import { Server as httpServer } from 'http'

export enum SOCKET_IO_EVENTS {
    CONNECTION = 'connection',
    DISCONNECT = 'disconnect'
}

export enum WS_ACTIONS {
    SET_USERNAME = 'SET_USERNAME',
    USER_JOINED = 'USER_JOINED',
    DISCONNECT = 'DISCONNECT',
    CHAT_MESSAGE = 'CHAT_MESSAGE',
    USER_TYPING = 'USER_TYPING',
    CHANGE_ROOM = 'CHANGE_ROOM',
    ROOM_CHANGED = 'ROOM_CHANGED'
}

export const GENERAL_ROOM = 'general'

export interface IServer {
    run(): void
}

export interface IHttpServer {
    httpServer: typeof express
    port: number
}

export interface ISocketServer {
    socketServer: typeof socketServer
    httpServer: httpServer
}

export type ExtendedSocket = Socket & {
    username: string
    room: string
}

export interface IPayloadWithMessage {
    message: string
}