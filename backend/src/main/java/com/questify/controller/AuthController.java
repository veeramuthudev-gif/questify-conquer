package com.questify.controller;

import com.questify.dto.ApiResponse;
import com.questify.dto.AuthResponse;
import com.questify.dto.LoginRequest;
import com.questify.dto.SignupRequest;
import com.questify.model.User;
import com.questify.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userService.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(request.getPassword())) {
                String token = "questify_jwt_" + UUID.randomUUID().toString();
                return ResponseEntity.ok(new AuthResponse(true, token, "Login successful", user));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Incorrect password. Please try again."));
            }
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Account not found for email: " + request.getEmail() + ". Please create an account."));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Email is required."));
        }

        if (userService.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "An account with this email already exists."));
        }

        User user = new User(
                request.getUsername() != null && !request.getUsername().trim().isEmpty() ? request.getUsername().trim() : "Adventurer",
                request.getEmail().trim(),
                request.getPassword()
        );
        user.setLevel(1);
        user.setXp(0);
        user.setXpToNextLevel(100);
        user.setTotalXp(0);
        user.setCurrentStreak(0);
        user.setBestStreak(0);
        user.setQuestsCompleted(0);
        user.setRank("Novice Adventurer");

        User saved = userService.save(user);
        String token = "questify_jwt_" + UUID.randomUUID().toString();
        return ResponseEntity.ok(new AuthResponse(true, token, "Welcome to Questify, " + saved.getUsername() + "!", saved));
    }
}
