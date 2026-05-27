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
}

export default APIs;