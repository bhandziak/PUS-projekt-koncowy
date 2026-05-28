package pus.projekt.websocket.dto;


public record RoomDataResponse(
        String room_id,
        String name,
        String owner,
        String owner_id
) {}
