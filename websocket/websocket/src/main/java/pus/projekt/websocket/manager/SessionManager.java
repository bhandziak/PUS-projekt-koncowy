package pus.projekt.websocket.manager;

import com.zaxxer.hikari.util.ConcurrentBag;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;
import tools.jackson.databind.ObjectMapper;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.CopyOnWriteArraySet;

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

    public void joinRoom(String roomId, WebSocketSession session) {
        String sessionId = session.getId();
        String currentRoom = sessionToRoom.get(sessionId);
        if (currentRoom != null && !currentRoom.equals(roomId)) {
            leaveRoom(currentRoom, session);
        }
        roomSubscriptions.computeIfAbsent(roomId, k -> new CopyOnWriteArraySet<>()).add(sessionId);
        sessionToRoom.put(sessionId, roomId);
    }

    public void leaveRoom(String roomId, WebSocketSession session) {
        String sessionId = session.getId();
        Set<String> subscibers = roomSubscriptions.get(roomId);
        if (subscibers != null) {
            subscibers.remove(sessionId);
            // Czyszczenie pamięci po ostatnim użytkowniku
            if (subscibers.isEmpty()) {
                roomSubscriptions.remove(roomId);
            }
        }
        sessionToRoom.remove(sessionId);
    }

    public void removeRoom(String roomId) {
        roomSubscriptions.remove(roomId);

        sessionToRoom.entrySet().removeIf(entry -> entry.getValue().equals(roomId));
    }
}
