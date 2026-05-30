import React, { createContext, useState, useCallback, useEffect } from 'react';
import { subscribeToBroadcast } from '../../api/websocket/client';
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

    // Init rooms list
    const fetchRooms = useCallback(async () => {
        const data = await getAll();
        if (data && data.rooms) {
            setRooms(data.rooms);
        }
    }, [getAll]);

    useEffect(() => {
        fetchRooms();
    }, []);

    // Broadcast listener for ROOM events
    useEffect(() => {
        const unsubscribe = subscribeToBroadcast('ROOM', (eventData) => {
            const { payload } = eventData;
            
            if (payload?.action === 'list_updated') {
                const { change_type, room_id, name, description } = payload.data;


                if (change_type === 'created') {
                    // add new room 
                    setRooms(prevRooms => {
                        if (prevRooms.some(r => r.room_id === room_id)) return prevRooms;
                        return [...prevRooms, { room_id, name, description }];
                    });
                } 
                else if (change_type === 'deleted') {
                    // delete room from list
                    setRooms(prevRooms => prevRooms.filter(r => r.room_id !== room_id));
                }
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);
    return (
        <RoomContext.Provider value={{ rooms, setRooms, fetchRooms, isLoading, error }}>
            {children}
        </RoomContext.Provider>
    );
};

export default RoomProvider;