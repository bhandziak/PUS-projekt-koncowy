import React from 'react';

interface RoomStatusProps {
    activeRoomId: string | null;
    isInteracting: boolean;
    interactionError: string | null;
}

const RoomStatus: React.FC<RoomStatusProps> = ({
    activeRoomId,
    isInteracting,
    interactionError,
}) => {
    if (!activeRoomId) return null;

    if (isInteracting) {
        return (
            <span className="text-amber-500 font-mono text-[11px] uppercase tracking-wider mt-1 flex items-center gap-1.5 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                [ Synchronizacja... ]
            </span>
        );
    }

    if (interactionError) {
        return (
            <span className="text-red-500 font-mono text-[11px] uppercase tracking-wider mt-1 flex items-center gap-1.5" title={interactionError}>
                <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                [ Błąd połączenia ]
            </span>
        );
    }

    return (
        <span className="dark-status-success mt-1 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping absolute inline-flex"></span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 relative inline-flex"></span>
            Połączono
        </span>
    );
};

export default RoomStatus;