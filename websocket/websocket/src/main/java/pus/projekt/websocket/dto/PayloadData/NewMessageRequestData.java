package pus.projekt.websocket.dto.PayloadData;

import java.util.UUID;

public record NewMessageRequestData(
        String room_id,
        UUID message_id,
        String author,
        String content,
        Integer timestamp
) {
}
