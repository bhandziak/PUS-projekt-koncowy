
export interface RoomItemProps {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    onClick: (id: string) => void;
}

const RoomItem= ({ id, name, description = '', isActive, onClick } : RoomItemProps) => {
    const truncatedDescription = description.length > 40 
        ? `${description.substring(0, 37)}...` 
        : description;

    return (
        <button
            onClick={() => onClick(id)}
            className={`cyber-room-item ${isActive ? 'active' : ''}`}
        >
            <div className="flex flex-col min-w-0 items-start text-left">
                <span className={`cyber-room-text ${isActive ? 'active' : ''}`}>
                    <span className="opacity-50 mr-1">#</span>
                    {name}
                </span>
                
                {description && (
                    <span className={`cyber-room-description ${isActive ? 'active' : ''}`}>
                        {truncatedDescription}
                    </span>
                )}
            </div>
            
            {isActive && (
                <span className="cyber-room-indicator-wrapper shrink-0 ml-2">
                    <span className="cyber-room-indicator-ping"></span>
                    <span className="cyber-room-indicator-dot"></span>
                </span>
            )}
        </button>
    );
};

export default RoomItem;