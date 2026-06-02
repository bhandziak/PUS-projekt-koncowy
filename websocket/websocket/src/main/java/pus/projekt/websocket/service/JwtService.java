package pus.projekt.websocket.service;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import pus.projekt.websocket.model.User;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {
    private static final String SECRET_KEY_STRING = "MojaSuperTajnaiBardzoDlugaZmiennaDoPodpisywaniaTokenowJWT12345!";
    private final SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY_STRING.getBytes());

    // 15 min w milisekundach
    private static final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 15;

    // 7 dni w milisekundach
    private static final long REFRESH_TOKEN_EXPIRATION = 1000 * 60 * 60 * 24 * 7;

    public String generateAccessToken(User user) {
        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("username", user.getUsername())
                .claim("role", user.getRole())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                .signWith(key)
                .compact();
    }

    public String generateRefreshToken(User user) {
        return Jwts.builder()
                .subject(user.getId().toString())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .signWith(key)
                .compact();
    }

    public TokenStatus validateToken(String token) {
        if (token == null || token.isBlank()) {
            return TokenStatus.INVALID;
        }

        try {
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return TokenStatus.VALID;
        } catch (ExpiredJwtException exception) {
            return TokenStatus.EXPIRED;
        } catch (Exception exception) {
            return TokenStatus.INVALID;
        }
    }

    public String extractUserId(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public String extractRole(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role", String.class);
    }

    public String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("username", String.class);
    }
}


