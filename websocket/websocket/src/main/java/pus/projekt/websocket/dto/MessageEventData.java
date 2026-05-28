package pus.projekt.websocket.dto;

public record MessageEventData(
        String room_id,
        String sender_name,
        String content
) {}
