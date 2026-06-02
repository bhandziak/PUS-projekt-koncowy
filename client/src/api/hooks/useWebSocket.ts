import { useContext, useCallback } from 'react';
import { AuthContext } from '../../app/providers/AuthProvider';
import { createWebSocketPacket } from '../utils/packetBuilder';
import type { EndpointTemplate } from '../types/websocket';
import { socket, registerPendingRequest } from '../websocket/client';
import { useRefreshToken } from '../../features/auth/hooks/useRefreshToken';
import { wsLogger } from '../../features/shared/utils/wsLogger';

export const useWebSocket = (isAuth: boolean = true) => {
    const authContext = useContext(AuthContext);
    const accessToken = authContext?.accessToken;
    const refreshToken = authContext?.refreshToken;
    
    const { refresh } = useRefreshToken();

    const send = useCallback(<T = any, R = any>(endpoint: EndpointTemplate, data: T | null = null): Promise<R> => {
        return new Promise((resolve, reject) => {
            
        const token = isAuth && accessToken ? accessToken : null;
        const packet = createWebSocketPacket(endpoint, data, token);
        const packetId = packet.meta.packet_id;

        if (socket && socket.readyState === WebSocket.OPEN) {

            // 1. Register packet with pending requests to handle the response later
            registerPendingRequest(packetId, {
                resolve: async (response) => {
                    if (response.status === 'OK') {
                        resolve(response);
                    } else {
                        // Token expiration handling
                        const isTokenExpired = response.error?.code === 'TOKEN_EXPIRED';

                        if (isTokenExpired && refreshToken) {
                            try {
                                const newAccessToken = await refresh();

                                const retryPacket = createWebSocketPacket(endpoint, data, newAccessToken);
                                
                                registerPendingRequest(retryPacket.meta.packet_id, {
                                    resolve: (retryResponse) => {
                                        if (retryResponse.status === 'OK') {
                                            resolve(retryResponse);
                                        } else {
                                            reject(retryResponse);
                                        }
                                    },
                                    reject // pass error to the original caller if retry also fails
                                });

                                socket.send(JSON.stringify(retryPacket));
                            } catch (refreshError) {
                                // refresh token failed
                                reject(refreshError);
                            }
                        } else {
                            // other errors (not token expiration)
                            reject(response);
                        }
                    }
                },
                reject // pass error to the original caller if retry also fails
            });
            
            // 2. Send packet to the server
            socket.send(JSON.stringify(packet));
            wsLogger.send( endpoint.type + '/' + endpoint.action, packet);
        } else {
            console.warn("WebSocket: Brak aktywnego połączenia!");
            reject(new Error("Brak połączenia z serwerem"));
        }
        });
    }, [isAuth, accessToken, refreshToken, refresh]);

    return { send };
};