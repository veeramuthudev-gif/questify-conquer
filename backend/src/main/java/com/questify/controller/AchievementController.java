package com.questify.controller;

import com.questify.model.Achievement;
import com.questify.service.AchievementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
@CrossOrigin(origins = "*")
public class AchievementController {

    private final AchievementService achievementService;

    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @GetMapping
    public List<Achievement> getAllAchievements() {
        return achievementService.getAllAchievements();
    }

    @PostMapping("/{id}/claim")
    public ResponseEntity<Achievement> claimAchievement(@PathVariable Long id) {
        Achievement claimed = achievementService.claimAchievement(id);
        return ResponseEntity.ok(claimed);
    }
}
