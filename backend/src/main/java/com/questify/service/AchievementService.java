package com.questify.service;

import com.questify.model.Achievement;
import com.questify.model.User;
import com.questify.repository.AchievementRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserService userService;

    public AchievementService(AchievementRepository achievementRepository, UserService userService) {
        this.achievementRepository = achievementRepository;
        this.userService = userService;
    }

    public List<Achievement> getAllAchievements() {
        return achievementRepository.findAll();
    }

    public Achievement claimAchievement(Long id) {
        Achievement achievement = achievementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Achievement not found"));

        if (!achievement.isUnlocked() && achievement.getProgress() >= 100) {
            achievement.setUnlocked(true);
            achievementRepository.save(achievement);

            User user = userService.getDefaultUser();
            userService.addXp(user.getId(), achievement.getXpReward());
        }

        return achievement;
    }
}
