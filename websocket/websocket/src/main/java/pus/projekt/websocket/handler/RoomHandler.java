package pus.projekt.websocket.handler;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import pus.projekt.websocket.config.TimestampConverter;
import pus.projekt.websocket.dto.Meta;
import pus.projekt.websocket.dto.Payload;
import pus.projekt.websocket.dto.Request;
import pus.projekt.websocket.dto.Response;
import pus.projekt.websocket.enums.ErrorCode;
import pus.projekt.websocket.enums.Type;
import pus.projekt.websocket.repository.RoomRepository;
import pus.projekt.websocket.service.JwtService;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.UUID;

@Component
@AllArgsConstructor
public class RoomHandler implements MessageHandler {
    private final ObjectMapper objectMapper;
    private final RoomRepository roomRepository;
    private final JwtService jwtService;

    @Override
    public Type getSupportedType() {
        return Type.ROOM;
    }

    @Override
    public void handle(WebSocketSession session, Request request) throws IOException {
        // Awaryjne meta na wypadek całkowitego braku meta
        Meta meta = request.meta() != null ? request.meta() : new Meta("1.0.0", UUID.randomUUID(), TimestampConverter.currentToSeconds());
        if (request.payload() == null || request.payload().action() == null) {
            sendError(session, request.payload(), ErrorCode.MISSING_FIELD, "Brak kluczowego pola (payload/action)", meta);
            return;
        }

        String token = request.token();
        if (token == null || !jwtService.isTokenValid(token)) {
            sendError(session, request.payload(), ErrorCode.UNAUTHORIZED, "Brak lub nieważny token autoryzacyjny", meta);
            return;
        }

        String action = request.payload().action();

        try {
            switch (action) {
                case "list":
                case "create":
                case "delete":
                case "join":
                case "leave":
                    // TODO add logic
                    break;
                default:
                    sendError(session, request.payload(), ErrorCode.UNKNOWN_ACTION, "Nieznana akcja dla typu ROOM", meta);
                    break;
            }
        } catch (IllegalArgumentException e) {
            sendError(session, request.payload(), ErrorCode.INVALID_DATA_TYPE, "Niepoprawny format danych", meta);
        }
    }

    private void sendError(WebSocketSession session, Payload originalPayload, ErrorCode code, String message, Meta meta) throws IOException {
        Meta errorMeta = new Meta(meta.version(), meta.packet_id(), TimestampConverter.currentToSeconds());
        Response errorResponse = Response.error(Type.ROOM, originalPayload, code, message, errorMeta);
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(errorResponse)));
    }
}
