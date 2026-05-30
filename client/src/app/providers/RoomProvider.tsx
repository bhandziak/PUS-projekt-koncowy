import React, { createContext, useState, useCallback, useEffect } from 'react';
import { useRoom } from '../../features/room/hooks/useRoom';
import type { RoomResponse } from '../../features/room/dto/RoomResponse';

export interface RoomContextType {
    rooms: RoomResponse[];
    setRooms: React.Dispatch<React.SetStateAction<RoomResponse[]>>;
    fetchRooms: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

export const RoomContext = createContext<RoomContextType | undefined>(undefined);

const RoomProvider = ({ children }: { children: React.ReactNode }) => {
    const [rooms, setRooms] = useState<RoomResponse[]>([]);
    
    const { getAll, isLoading, error } = useRoom();

    const fetchRooms = useCallback(async () => {
        const data = await getAll();
        if (data && data.rooms) {
            setRooms(data.rooms);
        }
    }, [getAll]);

    useEffect(() => {
        fetchRooms();
    }, []);

    // TODO - on_room_update event listener
    return (
        <RoomContext.Provider value={{ rooms, setRooms, fetchRooms, isLoading, error }}>
            {children}
        </RoomContext.Provider>
    );
};

export default RoomProvider;