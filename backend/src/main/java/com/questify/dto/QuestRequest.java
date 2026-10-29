package com.questify.dto;

import java.util.List;

public class QuestRequest {
    private String title;
    private String description;
    private String category;
    private String difficulty;
    private int xpReward;
    private String timeLimit;
    private String type;
    private String icon;
    private String color;
    private List<ObjectiveDto> objectives;

    public static class ObjectiveDto {
        private String title;
        private int current;
        private int target;
        private String unit;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public int getCurrent() { return current; }
        public void setCurrent(int current) { this.current = current; }

        public int getTarget() { return target; }
        public void setTarget(int target) { this.target = target; }

        public String getUnit() { return unit; }
        public void setUnit(String unit) { this.unit = unit; }
    }

    public QuestRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public int getXpReward() { return xpReward; }
    public void setXpReward(int xpReward) { this.xpReward = xpReward; }

    public String getTimeLimit() { return timeLimit; }
    public void setTimeLimit(String timeLimit) { this.timeLimit = timeLimit; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public List<ObjectiveDto> getObjectives() { return objectives; }
    public void setObjectives(List<ObjectiveDto> objectives) { this.objectives = objectives; }
}
