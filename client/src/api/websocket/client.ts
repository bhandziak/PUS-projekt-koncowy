import APIs from '../ApiURL';
/*
 * SINGLETON - global WebSocket client
 */

type WebSocketResolver = (response: any) => void;
type BroadcastListener = (payload: any) => void;

const pendingRequests = new Map<string, WebSocketResolver>();
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
            const resolve = pendingRequests.get(packetId);
            if (resolve) {
                resolve(responseData);
                pendingRequests.delete(packetId);
            }
            console.log('WebSocket: Received response for packet_id', packetId, responseData);
        } else {
            console.log('Broadcast or unassociated packet_id:', responseData);
            // Handle broadcast messages
            if (responseData.type) {
                const listeners = broadcastListeners.get(responseData.type);
                if (listeners) {
                    listeners.forEach(listener => listener(responseData));
                }
            }
        }
    } catch (e) {
        console.error('WebSocket: Error parsing message:', event.data, e);
    }
};

socket.onerror = (error) => console.error('WebSocket: Error:', error);
socket.onclose = () => console.warn('WebSocket: Connection closed.');

// TODO - add reconnection logic / throw error to hooks
export const registerPendingRequest = (packetId: string, resolver: WebSocketResolver) => {
    pendingRequests.set(packetId, resolver);

    // packet has 10 seconds to be resolved, otherwise it will be removed from pending requests
    setTimeout(() => {
        if (pendingRequests.has(packetId)) {
            console.warn(`WebSocket: Packet with ID ${packetId} timeout.`);
            pendingRequests.delete(packetId);
        }
    }, 10000);
};


export const subscribeToBroadcast = (type: string, callback: BroadcastListener) => {
    // Add subscriber callback
    if (!broadcastListeners.has(type)) {
        broadcastListeners.set(type, new Set());
    }
    broadcastListeners.get(type)!.add(callback);

    // Clean subscriber callback on unmount
    return () => {
        broadcastListeners.get(type)?.delete(callback);
    };
};