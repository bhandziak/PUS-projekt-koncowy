package pus.projekt.websocket.handler;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;
import pus.projekt.websocket.config.TimestampConverter;
import pus.projekt.websocket.dto.*;
import pus.projekt.websocket.dto.PayloadData.NewMessageRequestData;
import pus.projekt.websocket.enums.ErrorCode;
import pus.projekt.websocket.enums.Status;
import pus.projekt.websocket.enums.Type;
import pus.projekt.websocket.manager.SessionManager;
import pus.projekt.websocket.repository.RoomRepository;
import pus.projekt.websocket.service.JwtService;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.UUID;

@Component
@AllArgsConstructor
public class ChatHandler implements MessageHandler {
    private final ObjectMapper objectMapper;
    private final RoomRepository roomRepository;
    private final JwtService jwtService;
    private final SessionManager sessionManager;

    @Override
    public Type getSupportedType() {
        return Type.CHAT;
    }

    @Override
    public ObjectMapper getObjectMapper() {
        return this.objectMapper;
    }

    @Override
    public void handle(WebSocketSession session, Request request) throws IOException {
        Meta meta = request.meta() != null ? request.meta() : new Meta("1.0.0", UUID.randomUUID(), TimestampConverter.currentToSeconds());
        if (request.payload() == null || request.payload().action() == null) {
            sendError(
                    session,
                    request.payload(),
                    ErrorCode.MISSING_FIELD,
                    "Brak kluczowego pola (payload/action)",
                    meta
            );
            return;
        }

        String token = request.token();
        if (token == null || !jwtService.isTokenValid(token)) {
            sendError(
                    session,
                    request.payload(),
                    ErrorCode.UNAUTHORIZED,
                    "Brak lub nieważny token autoryzacyjny",
                    meta
            );
            return;
        }

        String action = request.payload().action();

        try {
            if (action.equals("send")) {
                handleSend(session, request, token, meta);
            } else {
                sendError(
                        session,
                        request.payload(),
                        ErrorCode.UNKNOWN_ACTION,
                        "Nieznana akcja dla typu CHAT",
                        meta
                );
            }
        } catch (IllegalArgumentException e) {
            sendError(
                    session,
                    request.payload(),
                    ErrorCode.INVALID_DATA_TYPE,
                    "Niepoprawny format danych wiadomości",
                    meta
            );
        }
    }

    private void handleSend(WebSocketSession session, Request request, String token, Meta meta) throws IOException {
        SendMessageData data = objectMapper.convertValue(request.payload().data(), SendMessageData.class);
        if (data.room_id() == null || data.content() == null || data.content().isBlank()) {
            sendError(session, request.payload(), ErrorCode.VALIDATION_ERROR, "Brak id pokoju lub treści wiadomości", meta);
            return;
        }
        UUID roomId;
        try {
            roomId = UUID.fromString(data.room_id());
        } catch (IllegalArgumentException e) {
            sendError(session, request.payload(), ErrorCode.VALIDATION_ERROR, "Niepoprawny format UUID pokoju", meta);
            return;
        }
        if (!roomRepository.existsById(roomId)) {
            sendError(session, request.payload(), ErrorCode.NOT_FOUND, "Pokój nie istnieje", meta);
            return;
        }

        String senderName = jwtService.extractUsername(token);

        sendSuccess(session, "send", null, meta);

        NewMessageRequestData eventData = new NewMessageRequestData(
                data.room_id(),
                senderName,
                data.content()
        );

        Event.MetaEvent metaEvent = new Event.MetaEvent("1.0.0", TimestampConverter.currentToSeconds());
        Event broadcastEvent = new Event(
                Type.CHAT,
                Status.OK,
                new Payload("new_message", eventData),
                metaEvent
        );

        sessionManager.broadcastToRoom(data.room_id(), broadcastEvent);
    }
}


