package pus.projekt.websocket.dto;

import java.time.LocalDateTime;

public record Event(
        // TODO enum?
        String type,
        // TODO enum?
        String status,
        Payload payload,
        MetaEvent metaEvent
) {
    public record MetaEvent (
            String version,
            // TODO nie wiem jaki typ na timestamp chcemy
            LocalDateTime timestamp
    ) {}
}
