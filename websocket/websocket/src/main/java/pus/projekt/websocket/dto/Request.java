package pus.projekt.websocket.dto;

public record Request(
        // TODO moze warto zmienic ze Stringa na Enum
        String type,

        Payload payload,
        String token,
        Meta meta
) {}
