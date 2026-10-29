package com.questify.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quests")
public class Quest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    private String category;
    private String difficulty;
    private int xpReward = 100;
    private String timeLimit = "30 mins";
    private String type = "Daily";
    private String status = "IN_PROGRESS"; // IN_PROGRESS, COMPLETED
    private String icon = "fa-scroll";
    private String color = "purple";

    @OneToMany(mappedBy = "quest", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Objective> objectives = new ArrayList<>();

    public Quest() {}

    public Quest(String title, String description, String category, String difficulty, int xpReward, String timeLimit, String type, String icon, String color) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.difficulty = difficulty;
        this.xpReward = xpReward;
        this.timeLimit = timeLimit;
        this.type = type;
        this.icon = icon;
        this.color = color;
    }

    public void addObjective(Objective obj) {
        objectives.add(obj);
        obj.setQuest(this);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public List<Objective> getObjectives() { return objectives; }
    public void setObjectives(List<Objective> objectives) { this.objectives = objectives; }
}
