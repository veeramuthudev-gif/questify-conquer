package com.questify.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_settings")
public class UserSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username = "Veera";
    private String email = "veera@example.com";
    private boolean darkMode = true;
    private boolean animatedInterface = true;
    private boolean streakReminders = true;
    private boolean questReminders = true;
    private boolean achievementAlerts = true;
    private boolean dailySuggestions = true;
    private boolean xpCelebration = true;

    public UserSetting() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public boolean isDarkMode() { return darkMode; }
    public void setDarkMode(boolean darkMode) { this.darkMode = darkMode; }

    public boolean isAnimatedInterface() { return animatedInterface; }
    public void setAnimatedInterface(boolean animatedInterface) { this.animatedInterface = animatedInterface; }

    public boolean isStreakReminders() { return streakReminders; }
    public void setStreakReminders(boolean streakReminders) { this.streakReminders = streakReminders; }

    public boolean isQuestReminders() { return questReminders; }
    public void setQuestReminders(boolean questReminders) { this.questReminders = questReminders; }

    public boolean isAchievementAlerts() { return achievementAlerts; }
    public void setAchievementAlerts(boolean achievementAlerts) { this.achievementAlerts = achievementAlerts; }

    public boolean isDailySuggestions() { return dailySuggestions; }
    public void setDailySuggestions(boolean dailySuggestions) { this.dailySuggestions = dailySuggestions; }

    public boolean isXpCelebration() { return xpCelebration; }
    public void setXpCelebration(boolean xpCelebration) { this.xpCelebration = xpCelebration; }
}
