package pus.projekt.websocket.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record Meta(
        String version,
        UUID packet_id,
        // TODO nie wiem jaki typ na timestamp chcemy
        LocalDateTime timestamp
) {}
