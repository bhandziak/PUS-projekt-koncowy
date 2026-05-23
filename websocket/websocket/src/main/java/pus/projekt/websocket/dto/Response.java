package pus.projekt.websocket.dto;

import pus.projekt.websocket.enums.ErrorCode;
import pus.projekt.websocket.enums.Status;
import pus.projekt.websocket.enums.Type;

import java.util.Map;

public record Response(
        Type type,
        Status status,
        Payload payload,
        ErrorDTO error,
        Meta meta
) {


    public record ErrorDTO(
            ErrorCode code,
            String message
    ) {}

    public static Response success(Type type, String action, Map<String, Object> data, Meta meta) {
        return new Response(type, Status.OK, new Payload(action, data), null, meta);
    }

    public static Response error(Type type, Payload originalPayload, ErrorCode code, String message, Meta meta) {
        return new Response(type, Status.FAIL, originalPayload, new ErrorDTO(code, message), meta);
    }
}
