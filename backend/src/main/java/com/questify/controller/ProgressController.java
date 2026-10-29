package com.questify.controller;

import com.questify.model.WeeklyActivity;
import com.questify.service.ProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "*")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(progressService.getOverallStats());
    }

    @GetMapping("/weekly")
    public ResponseEntity<List<WeeklyActivity>> getWeeklyChart() {
        return ResponseEntity.ok(progressService.getWeeklyActivities());
    }
}
