export interface SendMessageRequest {
    room_id: string;
    content: string;
}

export interface SendMessageResponse {
    message_id: string;
}