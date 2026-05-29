package pus.projekt.websocket.dto.PayloadData;

import java.util.List;

public record RoomsResponseData(
    List<RoomDataResponse> rooms
) {
}
