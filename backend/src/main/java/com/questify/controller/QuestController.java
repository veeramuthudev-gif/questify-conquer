package com.questify.controller;

import com.questify.dto.QuestRequest;
import com.questify.model.Objective;
import com.questify.model.Quest;
import com.questify.service.QuestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quests")
@CrossOrigin(origins = "*")
public class QuestController {

    private final QuestService questService;

    public QuestController(QuestService questService) {
        this.questService = questService;
    }

    @GetMapping
    public List<Quest> getAllQuests() {
        return questService.getAllQuests();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Quest> getQuestById(@PathVariable Long id) {
        return questService.getQuestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Quest> createQuest(@RequestBody QuestRequest request) {
        Quest created = questService.createQuest(request);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Quest> completeQuest(@PathVariable Long id) {
        Quest completed = questService.completeQuest(id);
        return ResponseEntity.ok(completed);
    }

    @PutMapping("/{questId}/objectives/{objectiveId}")
    public ResponseEntity<Objective> updateObjective(@PathVariable Long questId,
                                                    @PathVariable Long objectiveId,
                                                    @RequestBody Map<String, Integer> payload) {
        int current = payload.getOrDefault("current", 0);
        Objective updated = questService.updateObjective(objectiveId, current);
        return ResponseEntity.ok(updated);
    }
}
