package pus.projekt.websocket.dto.PayloadData;

public record LoginResponseData(
        String username,
        String access_token,
        String refresh_token,
        String user_id,
        String user_role
) {
}
