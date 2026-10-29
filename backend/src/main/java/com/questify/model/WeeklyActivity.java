package com.questify.model;

import jakarta.persistence.*;

@Entity
@Table(name = "weekly_activities")
public class WeeklyActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "activity_day")
    private String day;

    private int height;
    private boolean active = true;

    public WeeklyActivity() {}

    public WeeklyActivity(String day, int height, boolean active) {
        this.day = day;
        this.height = height;
        this.active = active;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }

    public int getHeight() { return height; }
    public void setHeight(int height) { this.height = height; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
