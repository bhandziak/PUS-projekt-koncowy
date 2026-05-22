package pus.projekt.websocket.dto;

import java.util.List;

public record Payload(
        // TODO moze lepszy enum
        String action,
        // TODO moze lepszy inny typ niz List<String>
        List<String> data
) {}
