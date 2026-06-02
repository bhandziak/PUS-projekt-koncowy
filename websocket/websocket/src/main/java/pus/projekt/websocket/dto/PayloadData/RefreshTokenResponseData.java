package pus.projekt.websocket.dto.PayloadData;

public record RefreshTokenResponseData(
        String access_token,
        String refresh_token,
        Integer expires_in
) {
}