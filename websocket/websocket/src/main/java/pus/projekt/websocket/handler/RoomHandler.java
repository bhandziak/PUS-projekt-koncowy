package pus.projekt.websocket.handler;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;
import pus.projekt.websocket.dto.Request;
import pus.projekt.websocket.enums.Type;
import pus.projekt.websocket.repository.RoomRepository;
import pus.projekt.websocket.service.JwtService;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

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
        // TODO add logic
    }
}
