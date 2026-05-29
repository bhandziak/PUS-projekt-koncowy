package pus.projekt.websocket.handler;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import pus.projekt.websocket.config.TimestampConverter;
import pus.projekt.websocket.dto.Meta;
import pus.projekt.websocket.dto.Payload;
import pus.projekt.websocket.dto.Request;
import pus.projekt.websocket.dto.Response;
import pus.projekt.websocket.enums.ErrorCode;
import pus.projekt.websocket.enums.PayloadAction;
import pus.projekt.websocket.enums.Type;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

public interface MessageHandler {
    Type getSupportedType();
    void handle(WebSocketSession session, Request request) throws IOException;
    ObjectMapper getObjectMapper();

    // Default success send
    default void sendSuccess(WebSocketSession session, PayloadAction action, Object responseData, Meta meta) throws IOException {
        Meta successMeta = new Meta("1.0.0", meta.packet_id(), TimestampConverter.currentToSeconds());
        Response successResponse = Response.success(getSupportedType(), action.getValue(), responseData, successMeta);
        session.sendMessage(new TextMessage(getObjectMapper().writeValueAsString(successResponse)));
    }

    // Default error send
    default void sendError(WebSocketSession session, Payload originalPayload, ErrorCode code, String message, Meta meta) throws IOException {
        Response errorResponse = Response.error(getSupportedType(), originalPayload, code, message, meta);
        session.sendMessage(new TextMessage(getObjectMapper().writeValueAsString(errorResponse)));
    }
}
