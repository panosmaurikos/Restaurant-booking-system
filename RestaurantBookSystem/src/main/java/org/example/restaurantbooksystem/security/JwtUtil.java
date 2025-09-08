package org.example.restaurantbooksystem.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.example.restaurantbooksystem.classes.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Arrays;
import java.util.Date;
import java.util.Optional;

@Component
public class JwtUtil {

    @Value("${secret_jwt}")
    private String JWT_SECRET;

    private final EncryptionUtil encryptionUtil;

    @Autowired
    public JwtUtil(EncryptionUtil encryptionUtil) {
        this.encryptionUtil = encryptionUtil;
    }

    // 1-hour expiration time
    public String generateToken(User user) {

        long expirationMillis = 3600 * 1000L;
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMillis);
        Key key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(JWT_SECRET));

        return Jwts.builder()
                .claim("id", user.getId().toString())
                .claim("username", user.getUsername())
                .claim("email", user.getEmail())
                .claim("role", user.getRole())
                .subject(user.getUsername())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public Claims validateToken(String encryptedToken) {
        try {
            String token = encryptionUtil.decrypt(encryptedToken);
            SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(JWT_SECRET));

            Jws<Claims> claimsJws = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);

            Claims claims = claimsJws.getPayload();
            Date expiration = claims.getExpiration();

            if (expiration.after(new Date())) {
                return claims;
            } else {
                return null;
            }
        } catch (Exception e) {
            return null;
        }
    }

    public Boolean isAuthenticated(HttpServletRequest request ){
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return false;
        }

        Optional<Cookie> jwtCookie = Arrays.stream(cookies)
                .filter(cookie -> "jwt".equals(cookie.getName()))
                .findFirst();

        if (jwtCookie.isPresent()) {
            String encryptedToken = jwtCookie.get().getValue();
            Claims isValid = validateToken(encryptedToken);

            return isValid != null;
        }
        return false;
    }

}