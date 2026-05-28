package pus.projekt.websocket.handler;


import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import pus.projekt.websocket.config.TimestampConverter;
import pus.projekt.websocket.dto.*;
import pus.projekt.websocket.enums.ErrorCode;
import pus.projekt.websocket.enums.Type;
import pus.projekt.websocket.model.User;
import pus.projekt.websocket.repository.UserRepository;
import pus.projekt.websocket.service.JwtService;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Component
@AllArgsConstructor
public class AuthHandler implements MessageHandler {
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public Type getSupportedType() {
        return Type.AUTH;
    }

    @Override
    public void handle(WebSocketSession session, Request request) throws IOException {
        Meta meta = request.meta() != null ? request.meta() : new Meta("1.0.0", UUID.randomUUID(), TimestampConverter.currentToSeconds());

        if (request.payload() == null || request.payload().action() == null) {
            sendError(
                    session,
                    request.payload(),
                    ErrorCode.MISSING_FIELD,
                    "Brak kluczowego pola (payload/action).",
                    meta
            );
            return;
        }

        String action = request.payload().action();
        try {

            switch (action) {
                case "register":
                    handleRegister(session, request, meta);
                    break;
                case "login":
                    handleLogin(session, request, meta);
                    break;
                case "logout":
                    // TODO add logout
                    break;
                case "refresh_token":
                    handleRefreshToken(session, request, meta);
                    break;
                default:
                    sendError(
                            session,
                            request.payload(),
                            ErrorCode.UNKNOWN_ACTION,
                            "Nieznana akcja dla typu AUTH",
                            meta
                    );
                    break;
            }
        } catch (IllegalArgumentException exception) {
        sendError(
                session,
                request.payload(),
                ErrorCode.INVALID_DATA_TYPE,
                "Niepoprawny format danych logowania",
                meta
        );
    }
    }

    private void handleRegister(WebSocketSession session, Request request, Meta meta) throws IOException {
        AuthData authData = objectMapper.convertValue(request.payload().data(), AuthData.class);

        if (authData.username() == null || authData.username().isBlank() ||
                authData.password() == null || authData.password().isBlank()) {
            sendError(
                    session,
                    request.payload(),
                    ErrorCode.VALIDATION_ERROR,
                    "Login i hasło nie mogą być puste",
                    meta
            );
            return;
        }

        if (userRepository.findByUsername(authData.username()).isPresent()) {
            sendError(
                    session,
                    request.payload(),
                    ErrorCode.VALIDATION_ERROR,
                    "Użytkownik o podanej nazwie już istnieje",
                    meta
            );
            return;
        }


        String encodedPassword = passwordEncoder.encode(authData.password());
        userRepository.save(new User(authData.username(), encodedPassword));
        sendSuccess(session, "register", Map.of("message", "Użytkownik zarejestrowany pomyślnie"), meta);
    }

    private void handleLogin(WebSocketSession session, Request request, Meta meta) throws IOException {
        AuthData authData = objectMapper.convertValue(request.payload().data(), AuthData.class);

        if (authData.username() == null || authData.password() == null) {
            sendError(
                    session,
                    request.payload(),
                    ErrorCode.VALIDATION_ERROR,
                    "Login i hasło są wymagane",
                    meta
            );
            return;
        }

        Optional<User> userOptional = userRepository.findByUsername(authData.username());
        if (userOptional.isEmpty() || !passwordEncoder.matches(authData.password(), userOptional.get().getPassword())) {
            sendError(
                    session,
                    request.payload(),
                    ErrorCode.UNAUTHORIZED,
                    "Niepoprawny login lub hasło",
                    meta
            );
            return;
        }

        User user = userOptional.get();
        Map<String, Object> responseData = Map.of(
                "username", user.getUsername(),
                "access_token", jwtService.generateAccessToken(user),
                "refresh_token", jwtService.generateRefreshToken(user),
                "user_id", user.getId().toString()
        );
        sendSuccess(session, "login", responseData, meta);
    }

    private void handleRefreshToken(WebSocketSession session, Request request, Meta meta) throws IOException {
        RefreshTokenData data = objectMapper.convertValue(request.payload().data(), RefreshTokenData.class);

        if (data.refreshToken() == null || data.refreshToken().isBlank()) {
            sendError(
                    session,
                    request.payload(),
                    ErrorCode.VALIDATION_ERROR,
                    "Brak tokenu odświeżania",
                    meta
            );
            return;
        }

        String incomingRefreshToken = data.refreshToken();

        if (!jwtService.isTokenValid(incomingRefreshToken)) {
            sendError(
                    session,
                    request.payload(),
                    ErrorCode.UNAUTHORIZED,
                    "Token odświeżania wygasł lub jest nieprawidłowy",
                    meta);
            return;
        }

        String userIdString = jwtService.extractUserId(incomingRefreshToken);
        UUID userId = UUID.fromString(userIdString);

        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            sendError(
                    session,
                    request.payload(),
                    ErrorCode.UNAUTHORIZED,
                    "Użytkownik powiązany z tym tokenem już nie istnieje",
                    meta
            );
            return;
        }

        User user = userOptional.get();

        Map<String, Object> responseData = Map.of(
                "accessToken", jwtService.generateAccessToken(user),
                "refreshToken", jwtService.generateRefreshToken(user),
                "expiresIn", 900 // 15 minut (w sekundach)
        );

        sendSuccess(session, "refresh_token", responseData, meta);
    }

    private void sendSuccess(WebSocketSession session, String action, Map<String, Object> responseData, Meta meta) throws IOException {
        Meta successMeta = new Meta("1.0.0", meta.packet_id(), TimestampConverter.currentToSeconds());
        Response successResponse = Response.success(Type.AUTH, action, responseData, successMeta);
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(successResponse)));
    }

    private void sendError(WebSocketSession session, Payload originalPayload, ErrorCode code, String message, Meta meta) throws IOException {
        Response errorResponse = Response.error(Type.AUTH, originalPayload, code, message, meta);
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(errorResponse)));
    }
}

