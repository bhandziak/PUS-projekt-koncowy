package pus.projekt.websocket.handler;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import pus.projekt.websocket.dto.Meta;
import pus.projekt.websocket.dto.Request;
import pus.projekt.websocket.dto.Response;
import pus.projekt.websocket.enums.ErrorCode;
import pus.projekt.websocket.enums.Status;
import pus.projekt.websocket.enums.Type;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

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
                    // Map payload to DTO request
                    Request clientRequest = objectMapper.treeToValue(rootNode, Request.class);

                    // get client action and handle invalid data (action/payload)
                    if (clientRequest.payload() == null || !clientRequest.payload().action().equals("hello")) {
                            Meta errorMeta = new Meta("1.0.0", UUID.randomUUID(), LocalDateTime.now());
                            Response validationError = new Response(
                                    Type.ERROR,
                                    Status.FAIL,
                                    null,
                                    new Response.ErrorDTO(ErrorCode.VALIDATION_ERROR, "sent payload is incorrect"),
                                    errorMeta
                            );
                            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(validationError)));
                            break;
                        }
                    // response build
                    Meta successMeta = new Meta(
                            "1.0.0",
                            UUID.randomUUID(),
                            LocalDateTime.now()
                    );
                    Map<String, Object> responseData = Map.of("message", "Witaj na serwerze IRC");

                    // response object
                    Response handshakeAck = Response.success(Type.HANDSHAKE, "hello", responseData, successMeta);

                    // convert to json and send
                    String jsonResponse = objectMapper.writeValueAsString(handshakeAck);
                    session.sendMessage(new TextMessage(jsonResponse));
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
