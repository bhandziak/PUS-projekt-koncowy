package pus.projekt.websocket.handler;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import pus.projekt.websocket.config.TimestampConverter;
import pus.projekt.websocket.dto.*;
import pus.projekt.websocket.enums.ErrorCode;
import pus.projekt.websocket.enums.Type;
import pus.projekt.websocket.model.Room;
import pus.projekt.websocket.model.UserRole;
import pus.projekt.websocket.repository.RoomRepository;
import pus.projekt.websocket.service.JwtService;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

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
            switch (action) {
                case "list":
                    handleList(session, request, meta);
                    break;
                case "create":
                    handleCreate(session, request, token, meta);
                    break;
                case "delete":
                case "join":
                case "leave":
                    // TODO add logic
                    break;
                default:
                    sendError(
                            session,
                            request.payload(),
                            ErrorCode.UNKNOWN_ACTION,
                            "Nieznana akcja dla typu ROOM",
                            meta
                    );
                    break;
            }
        } catch (IllegalArgumentException e) {
            sendError(
                    session,
                    request.payload(),
                    ErrorCode.INVALID_DATA_TYPE,
                    "Niepoprawny format danych",
                    meta
            );
        }
    }

    private void handleList(WebSocketSession session, Request request, Meta meta) throws IOException {
        List<RoomDataResponse> rooms = roomRepository.findAll().stream()
                .map(room -> new RoomDataResponse(
                        room.getId().toString(),
                        room.getName(),
                        room.getOwnerName(),
                        room.getOwnerId().toString()
                ))
                .collect(Collectors.toList());

        Map<String, Object> responseData = Map.of("rooms", rooms);
        sendSuccess(session, "list", responseData, meta);
    }

    private void handleCreate(WebSocketSession session, Request request, String token, Meta meta) throws IOException {

        String roleString = jwtService.extractRole(token);
        if (!UserRole.ADMIN.name().equals(roleString)) {
            sendError(
                    session,
                    request.payload(),
                    ErrorCode.FORBIDDEN,
                    "Tylko administrator może tworzyć pokoje",
                    meta
            );
            return;
        }

        CreateRoomData data = objectMapper.convertValue(request.payload().data(), CreateRoomData.class);

        if (data.name() == null || data.name().isBlank()) {
            sendError(
                    session,
                    request.payload(),
                    ErrorCode.VALIDATION_ERROR,
                    "Nazwa pokoju nie może być pusta",
                    meta
            );
            return;
        }

        Optional<Room> existingRoom = roomRepository.findByName(data.name());
        if (existingRoom.isPresent()) {
            sendError(
                    session,
                    request.payload(),
                    ErrorCode.VALIDATION_ERROR,
                    "Pokój o podanej nazwie już istnieje",
                    meta
            );
            return;
        }

        String ownerId = jwtService.extractUserId(token);
        String ownerName = jwtService.extractUsername(token);

        Room newRoom = new Room(data.name(), data.description(), UUID.fromString(ownerId), ownerName);
        roomRepository.save(newRoom);

        Map<String, Object> responseData = Map.of(
                "room_id", newRoom.getId().toString(),
                "name", newRoom.getName(),
                "description", newRoom.getDescription() != null ? newRoom.getDescription() : ""
        );

        sendSuccess(session, "create", responseData, meta);
    }

    private void sendSuccess(WebSocketSession session, String action, Map<String, Object> responseData, Meta meta) throws IOException {
        Meta successMeta = new Meta(meta.version(), meta.packet_id(), TimestampConverter.currentToSeconds());
        Response successResponse = Response.success(Type.ROOM, action, responseData, successMeta);
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(successResponse)));
    }

    private void sendError(WebSocketSession session, Payload originalPayload, ErrorCode code, String message, Meta meta) throws IOException {
        Meta errorMeta = new Meta(meta.version(), meta.packet_id(), TimestampConverter.currentToSeconds());
        Response errorResponse = Response.error(Type.ROOM, originalPayload, code, message, errorMeta);
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(errorResponse)));
    }
}
