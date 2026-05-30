import { useCallback, useState } from 'react';
import { useWebSocket } from '../../../api/hooks/useWebSocket';
import type { CreateRoomRequest } from '../dto/CreateRoomRequest';
import type { CreateRoomResponse } from '../dto/CreateRoomResponse';
import APIs from '../../../api/ApiURL';
import type { ListRoomResponse } from '../dto/ListRoomResponse';
import type { DeleteRoomRequest } from '../dto/DeleteRoomRequest';

export const useRoom = () => {
    const { send } = useWebSocket(true); 

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const createRoom = useCallback(async (data: CreateRoomRequest) => {
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
    }, [send]);

    const getAll = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await send<null, any>(APIs.LIST_ROOMS, null);
            return response.payload.data as ListRoomResponse;
        } catch (errPacket: any) {
            const backendMessage = 
                errPacket?.error?.message || 
                "Nie udało się pobrać listy węzłów.";
            
            setError(backendMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [send]);

    const deleteRoom = useCallback(async (data: DeleteRoomRequest) => {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);

        try {
            await send<DeleteRoomRequest, any>(APIs.DELETE_ROOM, data);
            setIsSuccess(true);
            return true;
        } catch (errPacket: any) {
            const backendMessage = 
                errPacket?.error?.message || 
                "Nie udało się usunąć pokoju. Spróbuj ponownie.";
            
            setError(backendMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [send]);
    return { createRoom, getAll, deleteRoom, isLoading, error, isSuccess };
};