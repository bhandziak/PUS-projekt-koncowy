package pus.projekt.websocket.handler;

import org.springframework.web.socket.WebSocketSession;
import pus.projekt.websocket.dto.Request;
import pus.projekt.websocket.enums.Type;

import java.io.IOException;

public interface MessageHandler {
    Type getSupportedType();
    void handle(WebSocketSession session, Request request) throws IOException;
}
