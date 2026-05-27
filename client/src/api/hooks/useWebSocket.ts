import { useContext, useCallback } from 'react';
import { AuthContext } from '../../app/providers/AuthProvider';
import { createWebSocketPacket } from '../utils/packetBuilder';
import type { EndpointTemplate } from '../types/websocket';

import { socket } from '../websocket/client'; 

export const useWebSocket = (isAuth: boolean = true) => {
    const authContext = useContext(AuthContext);
    const accessToken = authContext?.accessToken;

    const send = useCallback(<T = any>(endpoint: EndpointTemplate, data: T | null = null) => {
        const token = isAuth && accessToken ? accessToken : null;
        
        const packet = createWebSocketPacket(endpoint, data, token);

        console.log("WebSocket: Wysyłanie pakietu:", packet);

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(packet));
        } else {
            console.warn("WebSocket: Nie można wysłać wiadomości, brak aktywnego połączenia!");
        }
    }, [isAuth, accessToken]);

    return { send };
};