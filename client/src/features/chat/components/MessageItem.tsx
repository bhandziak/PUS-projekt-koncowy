export interface MessageItemProps {
    id?: string;
    author: string;
    timestamp: string;
    content: string;
    isOwnMessage?: boolean;
}

const MessageItem = ({ author, timestamp, content, isOwnMessage }: MessageItemProps) => {

    return (
        <div className={`cyber-message-item ${isOwnMessage ? 'own-message' : ''}`}>
            <div className="cyber-message-meta">
                <span className={`cyber-message-author`}>
                    {author}
                </span>
                <span className="cyber-message-timestamp">
                    [{timestamp}]
                </span>
            </div>
            <div className={`cyber-message-bubble ${isOwnMessage ? 'own-bubble' : ''}`}>
                {content}
            </div>
        </div>
    );
};

export default MessageItem;