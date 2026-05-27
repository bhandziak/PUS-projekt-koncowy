package pus.projekt.websocket.handler;

import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import pus.projekt.websocket.dto.*;
import pus.projekt.websocket.enums.ErrorCode;
import pus.projekt.websocket.enums.Type;
import pus.projekt.websocket.model.User;
import pus.projekt.websocket.repository.UserRepository;
import pus.projekt.websocket.service.JwtService;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.LocalDateTime;
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
        Meta meta = request.meta() != null ? request.meta() : new Meta("1.0.0", UUID.randomUUID(), LocalDateTime.now());

        if (request.payload() == null || request.payload().action() == null) {
            sendError(session, request.payload(), ErrorCode.MISSING_FIELD, "Brak kluczowego pola (payload/action).", meta);
            return;
        }

        String action = request.payload().action();

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
            default:
                sendError(session, request.payload(), ErrorCode.UNKNOWN_ACTION, "Nieznana akcja dla typu AUTH", meta);
                break;
        }
    }

    private void handleRegister(WebSocketSession session, Request request, Meta meta) throws IOException {
        try {
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

            Optional<User> existingUser = userRepository.findByUsername(authData.username());
            if (existingUser.isPresent()) {
                // Dokumentacja (UC002) sugeruje błąd gdy login jest zajęty
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
            User newUser = new User(authData.username(), encodedPassword);
            userRepository.save(newUser);

            Meta successMeta = new Meta("1.0.0", UUID.randomUUID(), LocalDateTime.now());
            Map<String, Object> responseData = Map.of("message", "Użytkownik zarejestrowany pomyślnie");

            Response successResponse = Response.success(Type.AUTH, "register", responseData, successMeta);
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(successResponse)));

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

    private void handleLogin(WebSocketSession session, Request request, Meta meta) throws IOException {
        try {
            AuthData authData = objectMapper.convertValue(request.payload().data(), AuthData.class);

            if (authData.username() == null || authData.password() == null) {
                sendError(session, request.payload(), ErrorCode.VALIDATION_ERROR, "Login i hasło są wymagane", meta);
                return;
            }

            Optional<User> userOptional = userRepository.findByUsername(authData.username());
            if (userOptional.isEmpty() || !passwordEncoder.matches(authData.password(), userOptional.get().getPassword())) {
                sendError(session, request.payload(), ErrorCode.UNAUTHORIZED, "Niepoprawny login lub hasło", meta);
                return;
            }

            User user = userOptional.get();

            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            Map<String, Object> responseData = Map.of(
                    "username", user.getUsername(),
                    "access_token", accessToken,
                    "refresh_token", refreshToken,
                    "user_id", user.getId().toString()
            );
            Meta successMeta = new Meta("1.0.0", UUID.randomUUID(), LocalDateTime.now());
            Response successResponse = Response.success(Type.AUTH, "login", responseData, successMeta);

            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(successResponse)));

        } catch (IllegalArgumentException exception) {
            sendError(
                    session,
                    request.payload(),
                    ErrorCode.INVALID_DATA_TYPE,
                    "Niepoprawny format danych",
                    meta
            );
        }
    }

    private void sendError(WebSocketSession session, Payload originalPayload, ErrorCode code, String message, Meta meta) throws IOException {
        Response errorResponse = Response.error(Type.AUTH, originalPayload, code, message, meta);
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(errorResponse)));
    }
}

