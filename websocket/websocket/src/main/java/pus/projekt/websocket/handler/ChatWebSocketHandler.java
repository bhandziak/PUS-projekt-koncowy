package pus.projekt.websocket.handler;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import pus.projekt.websocket.dto.Meta;
import pus.projekt.websocket.dto.Payload;
import pus.projekt.websocket.dto.Request;
import pus.projekt.websocket.dto.Response;
import pus.projekt.websocket.enums.ErrorCode;
import pus.projekt.websocket.enums.Type;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {
    private final ObjectMapper objectMapper;
    private final Map<Type, MessageHandler> handlers;

    public ChatWebSocketHandler(ObjectMapper objectMapper, List<MessageHandler> messageHandlers) {
        this.objectMapper = objectMapper;
        this.handlers = messageHandlers.stream()
                .collect(Collectors.toMap(MessageHandler::getSupportedType, Function.identity()));
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("New session added! Session id: " +  session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        System.out.println("Received message: " + payload);


        try {
            Request request = objectMapper.readValue(payload, Request.class);
            if (request.type() == null) {
                sendErrorResponse(
                        session,
                        request.payload(),
                        ErrorCode.MISSING_FIELD,
                        "Required field 'type' is missing",
                        request.meta()
                );
                return;
            }
            if (request.meta() == null || request.meta().packet_id() == null) {
                // TODO send error response
                return;
            }
            MessageHandler handler = handlers.get(request.type());
            if (handler != null) {
                System.out.println("handle");
                handler.handle(session, request);
            } else {
                System.out.println("unknown");
                // UNKNOWN_TYPE
                sendErrorResponse(
                        session,
                        request.payload(),
                        ErrorCode.UNKNOWN_TYPE,
                        "Unknown message type: " + request.type(),
                        request.meta()
                );
            }
        } catch (Exception exception) {
            // TODO change error message
            System.out.println("Bad syntax error");
            String syntaxError = "{\"type\":\"ERROR\", \"status\":\"FAIL\", \"error\": {\"code\": \"BAD_SYNTAX\"}}";
            session.sendMessage(new TextMessage(syntaxError));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println("Session closed. Session id: " + session.getId());
    }

    private void sendErrorResponse(WebSocketSession session, Payload originalPayload, ErrorCode code, String message, Meta meta) throws IOException {
        /*
        ERROR - globalna odpowiedź serwera na zapytania klienta w momencie  niepowodzenia operacji.
        To stan, w którym status przyjmuje wartość “fail”, type i payload.action zostaje taki sam jak w zapytaniu klienta.
        Dzięki temu frontend może łatwiej adresować błędy / sukcesy.
         */
        // TODO z dokumentacji wynika ze Type.ERROR nie powinien istnieć ale troche tego nie czaje

        Response errorResponse = Response.error(Type.ERROR, originalPayload, code, message, meta);
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(errorResponse)));
    }
}
