import { wsLogger } from '../../features/shared/utils/wsLogger';
import APIs from '../ApiURL';

/*
 * SINGLETON - global WebSocket client
 */

type WebSocketPromiseHandlers = {
    resolve: (response: any) => void; // response from server (success or error)
    reject: (reason: any) => void; // only for timeouts or client-side errors
};

type BroadcastListener = (payload: any) => void;

const pendingRequests = new Map<string, WebSocketPromiseHandlers>();
const broadcastListeners = new Map<string, Set<BroadcastListener>>();

export const socket = new WebSocket(APIs.SERVER_URL);

socket.onopen = () => {
    console.log('WebSocket: Connected to server!');
};

socket.onmessage = (event) => {
    try {
        const responseData = JSON.parse(event.data);
        const packetId = responseData.meta?.packet_id;

        if (packetId && pendingRequests.has(packetId)) {
            const handlers = pendingRequests.get(packetId);
            // Handle response - could be success or error from server
            if (handlers) {
                handlers.resolve(responseData);
                pendingRequests.delete(packetId);
            }
            
            if (responseData.status === 'OK') {
                wsLogger.receiveSuccess(responseData.type + '/' + responseData.payload.action, packetId, responseData);
            } else {
                wsLogger.receiveFail(responseData.type + '/' + responseData.payload.action, packetId, responseData);
            }
        } else {
            wsLogger.broadcast(responseData.type + '/' + responseData.payload.action, responseData);
            // Handle broadcast messages
            if (responseData.type) {
                const listeners = broadcastListeners.get(responseData.type);
                if (listeners) {
                    listeners.forEach(listener => listener(responseData));
                }
            }
        }
    } catch (e) {
        wsLogger.receiveFail('WebSocket: Error parsing message:', event.data, e);
    }
};

socket.onerror = (error) => console.error('WebSocket: Error:', error);
socket.onclose = () => console.warn('WebSocket: Connection closed.');


// TODO: add retry logic for failed sends
// Register a pending request
export const registerPendingRequest = (
    packetId: string, 
    handlers: WebSocketPromiseHandlers
) => {
    pendingRequests.set(packetId, handlers);

    // handle timeout
    setTimeout(() => {
        if (pendingRequests.has(packetId)) {
            console.warn(`WebSocket: Packet with ID ${packetId} timeout.`);
            
            const pendingHandlers = pendingRequests.get(packetId);
            pendingRequests.delete(packetId);

            // "throw" timeout error to the original caller
            if (pendingHandlers) {
                pendingHandlers.reject({
                    status: 'ERROR',
                    error: {
                        code: 408,
                        message: 'Przekroczono czas oczekiwania na odpowiedź serwera (Timeout).'
                    }
                });
            }
        }
    }, 10000); // 10 second timeout
};

export const subscribeToBroadcast = (type: string, callback: BroadcastListener) => {
    if (!broadcastListeners.has(type)) {
        broadcastListeners.set(type, new Set());
    }
    broadcastListeners.get(type)!.add(callback);

    return () => {
        broadcastListeners.get(type)?.delete(callback);
    };
};