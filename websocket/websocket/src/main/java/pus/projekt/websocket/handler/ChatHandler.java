package pus.projekt.websocket.handler;

import lombok.AllArgsConstructor;
import org.springframework.data.repository.query.ReactiveQueryByExampleExecutor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;
import pus.projekt.websocket.dto.Request;
import pus.projekt.websocket.enums.Type;
import pus.projekt.websocket.manager.SessionManager;
import pus.projekt.websocket.repository.RoomRepository;
import pus.projekt.websocket.service.JwtService;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

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
    public void handle(WebSocketSession session, Request request) throws IOException {

    }
}


