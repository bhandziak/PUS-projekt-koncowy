
export interface MessageItemProps {
    id?: string;
    author: string;
    timestamp: string;
    content: string;
}

const MessageItem = ({ author, timestamp, content }: MessageItemProps) => {
    const isSystem = author.toLowerCase() === 'system';

    return (
        <div className="cyber-message-item">
            <div className="cyber-message-meta">
                <span className={`cyber-message-author ${isSystem ? 'system' : ''}`}>
                    {author}
                </span>
                <span className="cyber-message-timestamp">
                    [{timestamp}]
                </span>
            </div>
            <div className={`cyber-message-bubble ${isSystem ? 'system' : ''}`}>
                {content}
            </div>
        </div>
    );
};

export default MessageItem;