package com.questify.service;

import com.questify.model.User;
import com.questify.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User getDefaultUser() {
        return userRepository.findAll().stream().findFirst().orElseGet(() -> {
            User defaultUser = new User("Veera", "veera@example.com", "password123");
            return userRepository.save(defaultUser);
        });
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public User addXp(Long userId, int amount) {
        User user = userRepository.findById(userId).orElse(getDefaultUser());
        user.setXp(user.getXp() + amount);
        user.setTotalXp(user.getTotalXp() + amount);

        while (user.getXp() >= user.getXpToNextLevel()) {
            user.setXp(user.getXp() - user.getXpToNextLevel());
            user.setLevel(user.getLevel() + 1);
            user.setXpToNextLevel((int) Math.round(user.getXpToNextLevel() * 1.25));
        }

        return userRepository.save(user);
    }
}
