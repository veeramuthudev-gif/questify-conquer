package com.questify.controller;

import com.questify.model.User;
import com.questify.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile() {
        return ResponseEntity.ok(userService.getDefaultUser());
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestBody User userUpdates) {
        User user = userService.getDefaultUser();
        if (userUpdates.getUsername() != null) user.setUsername(userUpdates.getUsername());
        if (userUpdates.getEmail() != null) user.setEmail(userUpdates.getEmail());
        if (userUpdates.getRank() != null) user.setRank(userUpdates.getRank());
        if (userUpdates.getLevel() > 0) user.setLevel(userUpdates.getLevel());
        if (userUpdates.getXp() >= 0) user.setXp(userUpdates.getXp());
        if (userUpdates.getTotalXp() >= 0) user.setTotalXp(userUpdates.getTotalXp());
        if (userUpdates.getCurrentStreak() >= 0) user.setCurrentStreak(userUpdates.getCurrentStreak());
        if (userUpdates.getBestStreak() >= 0) user.setBestStreak(userUpdates.getBestStreak());
        if (userUpdates.getQuestsCompleted() >= 0) user.setQuestsCompleted(userUpdates.getQuestsCompleted());

        User saved = userService.save(user);
        return ResponseEntity.ok(saved);
    }
}
