package pus.projekt.websocket.dto;

import java.util.List;
import java.util.Map;

public record Payload(
        // TODO moze lepszy enum
        String action,
        // TODO moze lepszy inny typ niz List<String>
        Map<String, Object> data
) {}
