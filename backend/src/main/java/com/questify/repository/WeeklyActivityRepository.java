package com.questify.repository;

import com.questify.model.WeeklyActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WeeklyActivityRepository extends JpaRepository<WeeklyActivity, Long> {
}
