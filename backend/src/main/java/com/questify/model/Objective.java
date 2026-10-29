package com.questify.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "objectives")
public class Objective {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private int currentCount;
    private int targetCount;
    private String unit = "tasks";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quest_id")
    @JsonBackReference
    private Quest quest;

    public Objective() {}

    public Objective(String title, int currentCount, int targetCount, String unit) {
        this.title = title;
        this.currentCount = currentCount;
        this.targetCount = targetCount;
        this.unit = unit;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public int getCurrent() { return currentCount; }
    public void setCurrent(int currentCount) { this.currentCount = currentCount; }

    public int getTarget() { return targetCount; }
    public void setTarget(int targetCount) { this.targetCount = targetCount; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Quest getQuest() { return quest; }
    public void setQuest(Quest quest) { this.quest = quest; }
}
