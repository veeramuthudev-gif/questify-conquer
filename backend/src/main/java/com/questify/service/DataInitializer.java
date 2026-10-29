package com.questify.service;

import com.questify.model.*;
import com.questify.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final QuestRepository questRepository;
    private final AchievementRepository achievementRepository;
    private final UserSettingRepository userSettingRepository;
    private final WeeklyActivityRepository weeklyActivityRepository;

    public DataInitializer(UserRepository userRepository,
                           QuestRepository questRepository,
                           AchievementRepository achievementRepository,
                           UserSettingRepository userSettingRepository,
                           WeeklyActivityRepository weeklyActivityRepository) {
        this.userRepository = userRepository;
        this.questRepository = questRepository;
        this.achievementRepository = achievementRepository;
        this.userSettingRepository = userSettingRepository;
        this.weeklyActivityRepository = weeklyActivityRepository;
    }

    @Override
    public void run(String... args) {
        // 1. Initial Starter User - Begins at Level 1 with 0 XP and 0 Quests
        if (userRepository.count() == 0) {
            User user = new User("Adventurer", "adventurer@questify.com", "password123");
            user.setRank("Novice Adventurer");
            user.setLevel(1);
            user.setXp(0);
            user.setXpToNextLevel(100);
            user.setTotalXp(0);
            user.setCurrentStreak(0);
            user.setBestStreak(0);
            user.setQuestsCompleted(0);
            user.setJoinedDate("Adventurer since 2026");
            userRepository.save(user);
        }

        // 2. Initial Starter Quest - Simple first tutorial quest to get started
        if (questRepository.count() == 0) {
            Quest q1 = new Quest(
                    "Begin Your Journey",
                    "Welcome to Questify! Explore your dashboard, complete your first task, and earn your first XP.",
                    "Personal",
                    "Easy",
                    50,
                    "15 min",
                    "Daily",
                    "fa-compass",
                    "purple"
            );
            q1.addObjective(new Objective("Complete your first daily goal", 0, 1, "task"));
            questRepository.save(q1);
        }

        // 3. Initial Achievements - All start LOCKED (0% progress)
        if (achievementRepository.count() == 0) {
            List<Achievement> achievements = Arrays.asList(
                    new Achievement("First Victory", "Complete your first quest.", "🏆", 100, false, 0, 0, 1),
                    new Achievement("3 Day Warrior", "Maintain a 3 day streak.", "🔥", 150, false, 0, 0, 3),
                    new Achievement("XP Seeker", "Earn 250 total XP.", "⚡", 200, false, 0, 0, 250),
                    new Achievement("Quest Apprentice", "Complete 5 quests.", "🎯", 250, false, 0, 0, 5),
                    new Achievement("7 Day Legend", "Maintain a 7 day streak.", "🔒", 500, false, 0, 0, 7),
                    new Achievement("XP Titan", "Reach 1,000 total XP.", "🔒", 750, false, 0, 0, 1000)
            );
            achievementRepository.saveAll(achievements);
        }

        // 4. Initial Settings
        if (userSettingRepository.count() == 0) {
            UserSetting setting = new UserSetting();
            setting.setUsername("Adventurer");
            setting.setEmail("adventurer@questify.com");
            userSettingRepository.save(setting);
        }

        // 5. Initial Weekly Activity - Starts at 0% for a clean slate
        if (weeklyActivityRepository.count() == 0) {
            List<WeeklyActivity> list = Arrays.asList(
                    new WeeklyActivity("MON", 0, false),
                    new WeeklyActivity("TUE", 0, false),
                    new WeeklyActivity("WED", 0, false),
                    new WeeklyActivity("THU", 0, false),
                    new WeeklyActivity("FRI", 0, false),
                    new WeeklyActivity("SAT", 0, false),
                    new WeeklyActivity("SUN", 0, false)
            );
            weeklyActivityRepository.saveAll(list);
        }
    }
}
