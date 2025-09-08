package org.example.restaurantbooksystem.controllers;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.restaurantbooksystem.classes.User;
import org.example.restaurantbooksystem.services.UserService;
import org.example.restaurantbooksystem.security.JwtUtil;
import org.example.restaurantbooksystem.security.EncryptionUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:8081", allowCredentials = "true")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final EncryptionUtil encryptionUtil;

    @Autowired
    public AuthController(UserService userService, JwtUtil jwtUtil, EncryptionUtil encryptionUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.encryptionUtil = encryptionUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User createdUser = userService.registerUser(user);
            createdUser.setPassword(null);
            return ResponseEntity.ok(createdUser);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error registering user");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData, HttpServletResponse response) {

        String email = loginData.get("email");
        String password = loginData.get("password");

        User user = userService.loginUser(email, password);
        if (user != null) {

            String token = jwtUtil.generateToken(user);
            String encryptedToken = encryptionUtil.encrypt(token);

            // Create cookie
            Cookie cookie = new Cookie("jwt", encryptedToken);
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setMaxAge(3600);
            cookie.setAttribute("SameSite", "Strict");
            cookie.setPath("/");
            response.addCookie(cookie);

            return ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "role", user.getRole()
            ));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No token provided");
        }

        Optional<Cookie> jwtCookie = Arrays.stream(cookies)
                .filter(cookie -> "jwt".equals(cookie.getName()))
                .findFirst();

        if (jwtCookie.isPresent()) {
            String encryptedToken = jwtCookie.get().getValue();
            Claims claims = jwtUtil.validateToken(encryptedToken);

            if (claims != null) {
                // Extract user information
                String userIdString = claims.get("id", String.class); // Extract id as a String
                UUID userId = UUID.fromString(userIdString); // Convert to UUID
                String username = claims.get("username", String.class);
                String email = claims.get("email", String.class);
                String role = claims.get("role", String.class);

                // Include user information
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Token is valid");
                response.put("user", Map.of(
                        "id", userId,
                        "username", username,
                        "email", email,
                        "role", role
                ));

                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setAttribute("SameSite", "Strict");
        cookie.setMaxAge(0); // Διαγραφή του cookie
        response.addCookie(cookie);

        return ResponseEntity.ok().body("Logged out successfully");
    }

    @GetMapping("/github/register")
    public void startGitHubRegistration(HttpServletRequest request, HttpServletResponse response) throws Exception {
        // Set a flag in the session to indicate this is a registration attempt
        request.getSession().setAttribute("oauth2_action", "register");
        // Redirect to the GitHub OAuth2 authorization endpoint
        response.sendRedirect("http://localhost:8080/oauth2/authorization/github");
    }

    @GetMapping("/github/callback")
    public void githubLogin(Authentication authentication, HttpServletRequest request, HttpServletResponse response) throws Exception {

        String action = (String) request.getSession().getAttribute("oauth2_action");
        boolean isRegister = "register".equals(action);

        try {
            if (authentication == null) {
                // Redirect to login page if an error occurs
                if (isRegister) {
                    response.sendRedirect("http://localhost:8081/pages/register.html");
                    return;
                }else{
                    response.sendRedirect("http://localhost:8081/pages/login.html");
                    return;
                }
            }

            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            String username = oAuth2User.getAttribute("login");
            String email = oAuth2User.getAttribute("email");


            User user = userService.checkGitHubUser(username);

            if (user == null && !isRegister) {
                response.sendRedirect("http://localhost:8081/pages/login.html");
                return;
            } else if (user == null && isRegister) {
                user = userService.createGitHubUser(username, email);
            }

            String token = jwtUtil.generateToken(user);
            String encryptedToken = encryptionUtil.encrypt(token);

            Cookie cookie = new Cookie("jwt", encryptedToken);
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setMaxAge(3600);
            cookie.setAttribute("SameSite", "Strict");
            cookie.setPath("/");
            response.addCookie(cookie);

            String role = user.getRole();
            if (role == null) {
                response.sendRedirect("http://localhost:8081/pages/login.html");
                return;
            }

            if (role.equals("MANAGER")) {
                response.sendRedirect("http://localhost:8081/pages/manager_dash.html");
            } else if (role.equals("USER")) {
                response.sendRedirect("http://localhost:8081/pages/selection.html");
            }

        } catch (Exception e) {
            if (isRegister) {
                response.sendRedirect("http://localhost:8081/pages/register.html");
            }else{
                response.sendRedirect("http://localhost:8081/pages/login.html");
            }
        } finally {
            // Clear the action from the session after use
            request.getSession().removeAttribute("oauth2_action");
        }
    }

}