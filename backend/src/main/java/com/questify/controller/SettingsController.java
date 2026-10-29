package com.questify.controller;

import com.questify.model.UserSetting;
import com.questify.repository.UserSettingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class SettingsController {

    private final UserSettingRepository userSettingRepository;

    public SettingsController(UserSettingRepository userSettingRepository) {
        this.userSettingRepository = userSettingRepository;
    }

    @GetMapping
    public ResponseEntity<UserSetting> getSettings() {
        UserSetting setting = userSettingRepository.findAll().stream().findFirst()
                .orElseGet(() -> userSettingRepository.save(new UserSetting()));
        return ResponseEntity.ok(setting);
    }

    @PutMapping
    public ResponseEntity<UserSetting> updateSettings(@RequestBody UserSetting updates) {
        UserSetting setting = userSettingRepository.findAll().stream().findFirst()
                .orElseGet(UserSetting::new);

        if (updates.getUsername() != null) setting.setUsername(updates.getUsername());
        if (updates.getEmail() != null) setting.setEmail(updates.getEmail());
        setting.setDarkMode(updates.isDarkMode());
        setting.setAnimatedInterface(updates.isAnimatedInterface());
        setting.setStreakReminders(updates.isStreakReminders());
        setting.setQuestReminders(updates.isQuestReminders());
        setting.setAchievementAlerts(updates.isAchievementAlerts());
        setting.setDailySuggestions(updates.isDailySuggestions());
        setting.setXpCelebration(updates.isXpCelebration());

        UserSetting saved = userSettingRepository.save(setting);
        return ResponseEntity.ok(saved);
    }
}
