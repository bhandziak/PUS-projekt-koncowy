package pus.projekt.websocket.handler;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("New session added! Session id: " +  session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        System.out.println("Received message: " + payload);


        try {
            // raw request JSON reading
            JsonNode rootNode = objectMapper.readTree(payload);
            String type = rootNode.has("type") ? rootNode.get("type").asText() : "UNKNOWN";

            switch (type) {
                case "HANDSHAKE":
                    // TODO return handshake json
                    break;
                default:
                    System.out.println("Request: Unknown type");
                    String errorResponse = "{\"type\":\"ERROR\", \"status\":\"FAIL\", \"error\": {\"code\": \"UNKNOWN_TYPE\"}}";
                    session.sendMessage(new TextMessage(errorResponse));
                    break;
            }
        } catch (Exception exception) {
            System.out.println("Bad syntax error");
            String syntaxError = "{\"type\":\"ERROR\", \"status\":\"FAIL\", \"error\": {\"code\": \"BAD_SYNTAX\"}}";
            session.sendMessage(new TextMessage(syntaxError));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println("Session closed. Session id: " + session.getId());
    }
}
