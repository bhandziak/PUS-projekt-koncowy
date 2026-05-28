package pus.projekt.websocket.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record Meta(
        String version,
        UUID packet_id,
        Integer timestamp
) {}
