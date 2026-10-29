package com.questify.service;

import com.questify.model.User;
import com.questify.model.WeeklyActivity;
import com.questify.repository.WeeklyActivityRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProgressService {

    private final UserService userService;
    private final WeeklyActivityRepository weeklyActivityRepository;

    public ProgressService(UserService userService, WeeklyActivityRepository weeklyActivityRepository) {
        this.userService = userService;
        this.weeklyActivityRepository = weeklyActivityRepository;
    }

    public Map<String, Object> getOverallStats() {
        User user = userService.getDefaultUser();

        Map<String, Object> stats = new HashMap<>();
        int quests = user.getQuestsCompleted();
        // Dynamic progress calculation: milestone is 10 quests for first major rank
        int overall = Math.min(100, quests * 10);

        stats.put("overallProgress", overall);
        stats.put("streak", user.getCurrentStreak());
        stats.put("bestStreak", user.getBestStreak());
        stats.put("totalXp", user.getTotalXp());
        stats.put("currentLevel", user.getLevel());
        stats.put("questsCompleted", user.getQuestsCompleted());
        stats.put("weeklyXpGain", user.getXp());

        return stats;
    }

    public List<WeeklyActivity> getWeeklyActivities() {
        return weeklyActivityRepository.findAll();
    }
}
