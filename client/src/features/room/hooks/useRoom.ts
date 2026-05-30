import { useState } from 'react';
import { useWebSocket } from '../../../api/hooks/useWebSocket';
import type { CreateRoomRequest } from '../dto/CreateRoomRequest';
import type { CreateRoomResponse } from '../dto/CreateRoomResponse';
import APIs from '../../../api/ApiURL';

export const useRoom = () => {
    const { send } = useWebSocket(true); 

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const createRoom = async (data: CreateRoomRequest) => {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);

        try {
            const response = await send<CreateRoomRequest, any>(APIs.CREATE_ROOM, data);
            
            setIsSuccess(true);
            return response.payload.data as CreateRoomResponse; 
        } catch (errPacket: any) {
            const backendMessage = 
                errPacket?.error?.message || 
                "Nie udało się utworzyć pokoju. Spróbuj ponownie.";
            
            setError(backendMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { createRoom, isLoading, error, isSuccess };
};