package pus.projekt.websocket.dto.PayloadData;

public record RoomJoinLeaveResponseData(
        String room_id,
        String message
) {
}
