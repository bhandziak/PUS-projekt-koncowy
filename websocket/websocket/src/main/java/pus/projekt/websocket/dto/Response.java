package pus.projekt.websocket.dto;

public record Response(
        // TODO Enum?
        String type,
        // TODO Enum?
        String status,
        Payload payload,
        ErrorDTO error,
        Meta meta
) {
    public record ErrorDTO(
            String code,
            String message
    ) {}
}
