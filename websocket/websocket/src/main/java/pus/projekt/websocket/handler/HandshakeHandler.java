package pus.projekt.websocket.handler;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import pus.projekt.websocket.dto.Meta;
import pus.projekt.websocket.dto.Payload;
import pus.projekt.websocket.dto.Request;
import pus.projekt.websocket.dto.Response;
import pus.projekt.websocket.enums.ErrorCode;
import pus.projekt.websocket.enums.Type;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Component
public class HandshakeHandler implements MessageHandler {
    private final ObjectMapper objectMapper;

    public HandshakeHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public Type getSupportedType() {
        return Type.HANDSHAKE;
    }

    @Override
    public void handle(WebSocketSession session, Request request) throws IOException {
        System.out.println("handle");
        Meta meta = request.meta() != null ? request.meta() : new Meta("1.0.0", UUID.randomUUID(), LocalDateTime.now());

        if (request.payload() == null || request.payload().action() == null) {
            sendErrorResponse(session, request.payload(), ErrorCode.MISSING_FIELD, "Missing field (payload/action).", meta);
            return;
        }

        String action = request.payload().action();

        if (action.equals("hello")) {
            handleHello(session, request, meta);
        } else if (action.equals("bye")) {
            System.out.println("Client ends the connection.");
        } else {
            sendErrorResponse(session, request.payload(), ErrorCode.UNKNOWN_ACTION, "Unknown action for HANDSHAKE.", meta);
        }
    }

    private void handleHello(WebSocketSession session, Request request, Meta clientMeta) throws IOException {
        System.out.println("handle hello");

        Meta successMeta = new Meta("1.0.0", clientMeta.packet_id(), LocalDateTime.now()); //clientMeta packet id
        Map<String, Object> responseData = Map.of("message", "Witaj na serwerze IRC");
        Response handshakeAck = Response.success(Type.HANDSHAKE, "hello", responseData, successMeta);
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(handshakeAck)));
    }

    private void sendErrorResponse(WebSocketSession session, Payload originalPayload, ErrorCode code, String message, Meta meta) throws IOException {
        Response errorResponse = Response.error(Type.HANDSHAKE, originalPayload, code, message, meta);
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(errorResponse)));
    }
}

