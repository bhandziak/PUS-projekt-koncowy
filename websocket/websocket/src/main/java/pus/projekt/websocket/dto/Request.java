package pus.projekt.websocket.dto;

import pus.projekt.websocket.enums.Type;

public record Request(
        Type type,
        Payload payload,
        String token,
        Meta meta
) {}
