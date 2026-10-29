package com.questify.model;

import jakarta.persistence.*;

@Entity
@Table(name = "achievements")
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String badge;
    private int xpReward;
    private boolean unlocked;
    private int progress;
    private int currentVal;
    private int targetVal;

    public Achievement() {}

    public Achievement(String title, String description, String badge, int xpReward, boolean unlocked, int progress, int currentVal, int targetVal) {
        this.title = title;
        this.description = description;
        this.badge = badge;
        this.xpReward = xpReward;
        this.unlocked = unlocked;
        this.progress = progress;
        this.currentVal = currentVal;
        this.targetVal = targetVal;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }

    public int getXpReward() { return xpReward; }
    public void setXpReward(int xpReward) { this.xpReward = xpReward; }

    public boolean isUnlocked() { return unlocked; }
    public void setUnlocked(boolean unlocked) { this.unlocked = unlocked; }

    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }

    public int getCurrent() { return currentVal; }
    public void setCurrent(int currentVal) { this.currentVal = currentVal; }

    public int getTarget() { return targetVal; }
    public void setTarget(int targetVal) { this.targetVal = targetVal; }
}
