import type { EndpointTemplate } from "./types/websocket";

const APIs = {
    SERVER_URL: "ws://localhost:8080/chat",

    // HANDSHAKE
    HELLO: { 
        type: 'HANDSHAKE', action: 'hello'
    } as EndpointTemplate,
    
    // AUTH
    LOGIN: { 
        type: 'AUTH', action: 'login' 
    } as EndpointTemplate,
    REGISTER: { 
        type: 'AUTH', action: 'register'
    } as EndpointTemplate,
    REFRESH_TOKEN: {
        type: 'AUTH', action: 'refresh_token'
    } as EndpointTemplate,

    // ROOM
    CREATE_ROOM: {
        type: 'ROOM', action: 'create'
    } as EndpointTemplate,
    DELETE_ROOM: {
        type: 'ROOM', action: 'delete'
    } as EndpointTemplate,
    ON_ROOM_UPDATE: {
        type: 'ROOM', action: 'list_updated'
    } as EndpointTemplate,
    JOIN_ROOM: {
        type: 'ROOM', action: 'join'
    } as EndpointTemplate,
    LEAVE_ROOM: {
        type: 'ROOM', action: 'leave'
    } as EndpointTemplate,
    LIST_ROOMS: {
        type: 'ROOM', action: 'list'
    } as EndpointTemplate,

    // CHAT
    SEND_MESSAGE: {
        type: 'CHAT', action: 'send'
    } as EndpointTemplate,
    ON_NEW_MESSAGE: {
        type: 'CHAT', action: 'new_message'
    } as EndpointTemplate,
}

export default APIs;