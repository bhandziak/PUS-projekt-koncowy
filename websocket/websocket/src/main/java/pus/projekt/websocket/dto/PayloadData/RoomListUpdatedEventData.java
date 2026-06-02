package pus.projekt.websocket.dto.PayloadData;

public record RoomListUpdatedEventData (
        String change_type,
        String room_id,
        String name,
        String description
){}
