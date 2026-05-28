import { useContext, useCallback } from 'react';
import { AuthContext } from '../../app/providers/AuthProvider';
import { createWebSocketPacket } from '../utils/packetBuilder';
import type { EndpointTemplate } from '../types/websocket';
import { socket, registerPendingRequest } from '../websocket/client';

export const useWebSocket = (isAuth: boolean = true) => {
    const authContext = useContext(AuthContext);
    const accessToken = authContext?.accessToken;

    const send = useCallback(<T = any, R = any>(endpoint: EndpointTemplate, data: T | null = null): Promise<R> => {
        return new Promise((resolve, reject) => {
            const token = isAuth && accessToken ? accessToken : null;
            
            const packet = createWebSocketPacket(endpoint, data, token);
            const packetId = packet.meta.packet_id;

            if (socket && socket.readyState === WebSocket.OPEN) {
                // 1. Register packet with pending requests to handle the response later
                registerPendingRequest(packetId, (response) => {
                    if (response.status === 'OK') {
                        resolve(response);
                    } else {
                        reject(response);
                    }
                });

                // 2. Send packet to the server
                socket.send(JSON.stringify(packet));

                console.log('WebSocket: Sent packet to server:', packet);
            } else {
                console.warn("WebSocket: Brak aktywnego połączenia!");
                reject(new Error("Brak połączenia z serwerem"));
            }
        });
    }, [isAuth, accessToken]);

    return { send };
};