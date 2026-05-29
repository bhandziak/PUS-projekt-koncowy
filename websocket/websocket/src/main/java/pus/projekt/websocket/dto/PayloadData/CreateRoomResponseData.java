package pus.projekt.websocket.dto.PayloadData;

public record CreateRoomResponseData(
        String room_id,
        String name,
        String description
) {
}
