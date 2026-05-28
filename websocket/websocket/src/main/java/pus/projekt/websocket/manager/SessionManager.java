package pus.projekt.websocket.manager;

import com.zaxxer.hikari.util.ConcurrentBag;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;
import tools.jackson.databind.ObjectMapper;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Component
public class SessionManager {
    private final ObjectMapper objectMapper;
    // otwarte sesje: sessionId -> WebSocketSession
    private final Map<String, WebSocketSession> activeSessions = new ConcurrentHashMap<>();
    // kto jest w jakim pokoju: roomId -> set<sessionId>
    private final Map<String, Set<String>> roomSubscriptions = new ConcurrentHashMap<>();
    // w jakim pokoju jest dany użytkownik: sessionId -> roomId
    private final Map<String, String> sessionToRoom = new ConcurrentHashMap<>();

    public SessionManager(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public void addSession(WebSocketSession session) {
        activeSessions.put(session.getId(), session);
    }

    public void removeSession(WebSocketSession session) {
        String sessionId = session.getId();
        activeSessions.remove(sessionId);

        String currentRoom = sessionToRoom.remove(sessionId);
        if (currentRoom != null) {
            Set<String> subscribers = roomSubscriptions.get(currentRoom);
            if (subscribers != null) {
                subscribers.remove(sessionId);
            }
        }
    }
}
