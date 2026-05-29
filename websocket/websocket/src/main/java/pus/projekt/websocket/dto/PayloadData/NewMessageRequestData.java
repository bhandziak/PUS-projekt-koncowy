package pus.projekt.websocket.dto.PayloadData;

public record NewMessageRequestData(
        String room_id,
        String sender_name,
        String content
) {
}
