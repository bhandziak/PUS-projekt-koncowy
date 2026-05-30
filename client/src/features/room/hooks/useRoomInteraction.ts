import { useState, useCallback } from 'react';
import { useWebSocket } from '../../../api/hooks/useWebSocket';
import APIs from '../../../api/ApiURL';
import type { RoomInteractionRequest, RoomInteractionResponse } from '../dto/RoomInteractionDtos';

export const useRoomInteraction = () => {
    const { send } = useWebSocket(true);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const joinRoom = useCallback(async (data: RoomInteractionRequest) => {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);

        try {
            const response = await send<RoomInteractionRequest, any>(APIs.JOIN_ROOM, data);
            
            setIsSuccess(true);
            return response.payload.data as RoomInteractionResponse;
        } catch (errPacket: any) {
            const backendMessage = 
                errPacket?.error?.message || 
                "Błąd synchronizacji: nie udało się dołączyć do węzła.";
            
            setError(backendMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [send]);

    const leaveRoom = useCallback(async (data: RoomInteractionRequest) => {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);

        try {
            const response = await send<RoomInteractionRequest, any>(APIs.LEAVE_ROOM, data);
            
            setIsSuccess(true);
            return response.payload.data as RoomInteractionResponse;
        } catch (errPacket: any) {
            const backendMessage = 
                errPacket?.error?.message || 
                "Błąd synchronizacji: nie udało się opuścić węzła.";
            
            setError(backendMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [send]);

    return { joinRoom, leaveRoom, isLoading, error, isSuccess };
};