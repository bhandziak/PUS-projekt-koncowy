package pus.projekt.websocket.dto;

import java.util.List;
import java.util.Map;

public record Payload(
        // TODO moze lepszy enum
        String action,
        Object data
) {}
