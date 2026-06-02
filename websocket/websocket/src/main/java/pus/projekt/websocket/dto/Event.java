package pus.projekt.websocket.dto;

import pus.projekt.websocket.enums.Status;
import pus.projekt.websocket.enums.Type;

import java.time.LocalDateTime;

public record Event(
        Type type,
        Status status,
        Payload payload,
        MetaEvent metaEvent
) {
    public record MetaEvent (
            String version,
            Integer timestamp
    ) {}
}
