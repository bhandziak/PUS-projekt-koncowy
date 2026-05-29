package pus.projekt.websocket.handler;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import pus.projekt.websocket.config.TimestampConverter;
import pus.projekt.websocket.dto.*;
import pus.projekt.websocket.dto.PayloadData.MessageResponseData;
import pus.projekt.websocket.enums.ErrorCode;
import pus.projekt.websocket.enums.Type;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
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
    public ObjectMapper getObjectMapper() {
        return this.objectMapper;
    }

    @Override
    public void handle(WebSocketSession session, Request request) throws IOException {
        System.out.println("handle");
        Meta meta = request.meta() != null ? request.meta() : new Meta("1.0.0", UUID.randomUUID(), TimestampConverter.currentToSeconds());

        if (request.payload() == null || request.payload().action() == null) {
            sendError(session, request.payload(), ErrorCode.MISSING_FIELD, "Missing field (payload/action).", meta);
            return;
        }

        String action = request.payload().action();

        if (action.equals("hello")) {
            handleHello(session, request, meta);
        } else if (action.equals("bye")) {
            System.out.println("Client ends the connection.");
        } else {
            sendError(session, request.payload(), ErrorCode.UNKNOWN_ACTION, "Unknown action for HANDSHAKE.", meta);
        }
    }

    private void handleHello(WebSocketSession session, Request request, Meta clientMeta) throws IOException {
        System.out.println("handle hello");

        Meta successMeta = new Meta("1.0.0", clientMeta.packet_id(), TimestampConverter.currentToSeconds()); //clientMeta packet id
        MessageResponseData responseData = new MessageResponseData(
                "Witaj na serwerze IRC"
        );
        Response handshakeAck = Response.success(Type.HANDSHAKE, "hello", responseData, successMeta);
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(handshakeAck)));
    }
}

