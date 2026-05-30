export interface ChatMessage {
    room_id: string;
    message_id: string;
    author: string;
    content: string;
    timestamp: number;
}