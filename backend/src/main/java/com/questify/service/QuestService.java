package com.questify.service;

import com.questify.dto.QuestRequest;
import com.questify.model.Achievement;
import com.questify.model.Objective;
import com.questify.model.Quest;
import com.questify.model.User;
import com.questify.repository.AchievementRepository;
import com.questify.repository.ObjectiveRepository;
import com.questify.repository.QuestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestService {

    private final QuestRepository questRepository;
    private final ObjectiveRepository objectiveRepository;
    private final UserService userService;
    private final AchievementRepository achievementRepository;

    public QuestService(QuestRepository questRepository,
                        ObjectiveRepository objectiveRepository,
                        UserService userService,
                        AchievementRepository achievementRepository) {
        this.questRepository = questRepository;
        this.objectiveRepository = objectiveRepository;
        this.userService = userService;
        this.achievementRepository = achievementRepository;
    }

    public List<Quest> getAllQuests() {
        return questRepository.findAll();
    }

    public Optional<Quest> getQuestById(Long id) {
        return questRepository.findById(id);
    }

    public Quest createQuest(QuestRequest request) {
        Quest quest = new Quest(
                request.getTitle() != null ? request.getTitle() : "Untitled Quest",
                request.getDescription(),
                request.getCategory() != null ? request.getCategory() : "General",
                request.getDifficulty() != null ? request.getDifficulty() : "Medium",
                request.getXpReward() > 0 ? request.getXpReward() : 100,
                request.getTimeLimit() != null ? request.getTimeLimit() : "30 mins",
                request.getType() != null ? request.getType() : "Daily",
                request.getIcon() != null ? request.getIcon() : "fa-scroll",
                request.getColor() != null ? request.getColor() : "purple"
        );

        if (request.getObjectives() != null && !request.getObjectives().isEmpty()) {
            for (QuestRequest.ObjectiveDto objDto : request.getObjectives()) {
                Objective objective = new Objective(
                        objDto.getTitle(),
                        objDto.getCurrent(),
                        objDto.getTarget() > 0 ? objDto.getTarget() : 1,
                        objDto.getUnit() != null ? objDto.getUnit() : "task"
                );
                quest.addObjective(objective);
            }
        } else {
            Objective defaultObjective = new Objective("Complete goal challenge", 0, 1, "task");
            quest.addObjective(defaultObjective);
        }

        return questRepository.save(quest);
    }

    public Quest completeQuest(Long id) {
        Quest quest = questRepository.findById(id).orElseThrow(() -> new RuntimeException("Quest not found"));
        if (!"COMPLETED".equalsIgnoreCase(quest.getStatus())) {
            quest.setStatus("COMPLETED");

            for (Objective obj : quest.getObjectives()) {
                obj.setCurrent(obj.getTarget());
            }

            questRepository.save(quest);

            // Award XP to user and increment quest count
            User user = userService.getDefaultUser();
            user.setQuestsCompleted(user.getQuestsCompleted() + 1);
            if (user.getCurrentStreak() == 0) {
                user.setCurrentStreak(1);
            }
            if (user.getCurrentStreak() > user.getBestStreak()) {
                user.setBestStreak(user.getCurrentStreak());
            }

            userService.addXp(user.getId(), quest.getXpReward());

            // Dynamic Achievement Checks
            checkAndUnlockAchievements(user);
        }
        return quest;
    }

    private void checkAndUnlockAchievements(User user) {
        List<Achievement> achievements = achievementRepository.findAll();
        for (Achievement ach : achievements) {
            if ("First Victory".equalsIgnoreCase(ach.getTitle())) {
                ach.setCurrent(Math.min(1, user.getQuestsCompleted()));
                ach.setProgress(user.getQuestsCompleted() >= 1 ? 100 : 0);
                if (user.getQuestsCompleted() >= 1) ach.setUnlocked(true);
            } else if ("Quest Apprentice".equalsIgnoreCase(ach.getTitle())) {
                ach.setCurrent(Math.min(5, user.getQuestsCompleted()));
                ach.setProgress(Math.min(100, (user.getQuestsCompleted() * 100) / 5));
                if (user.getQuestsCompleted() >= 5) ach.setUnlocked(true);
            } else if ("XP Seeker".equalsIgnoreCase(ach.getTitle())) {
                ach.setCurrent(Math.min(250, user.getTotalXp()));
                ach.setProgress(Math.min(100, (user.getTotalXp() * 100) / 250));
                if (user.getTotalXp() >= 250) ach.setUnlocked(true);
            } else if ("XP Titan".equalsIgnoreCase(ach.getTitle())) {
                ach.setCurrent(Math.min(1000, user.getTotalXp()));
                ach.setProgress(Math.min(100, (user.getTotalXp() * 100) / 1000));
                if (user.getTotalXp() >= 1000) ach.setUnlocked(true);
            } else if ("3 Day Warrior".equalsIgnoreCase(ach.getTitle())) {
                ach.setCurrent(Math.min(3, user.getCurrentStreak()));
                ach.setProgress(Math.min(100, (user.getCurrentStreak() * 100) / 3));
                if (user.getCurrentStreak() >= 3) ach.setUnlocked(true);
            } else if ("7 Day Legend".equalsIgnoreCase(ach.getTitle())) {
                ach.setCurrent(Math.min(7, user.getCurrentStreak()));
                ach.setProgress(Math.min(100, (user.getCurrentStreak() * 100) / 7));
                if (user.getCurrentStreak() >= 7) ach.setUnlocked(true);
            }
        }
        achievementRepository.saveAll(achievements);
    }

    public Objective updateObjective(Long objectiveId, int currentCount) {
        Objective obj = objectiveRepository.findById(objectiveId).orElseThrow(() -> new RuntimeException("Objective not found"));
        obj.setCurrent(Math.min(currentCount, obj.getTarget()));
        return objectiveRepository.save(obj);
    }
}
