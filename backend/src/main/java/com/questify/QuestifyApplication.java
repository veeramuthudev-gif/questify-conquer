package com.questify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class QuestifyApplication {

    public static void main(String[] args) {
        SpringApplication.run(QuestifyApplication.class, args);
        System.out.println("=================================================");
        System.out.println("⚔️  QUESTIFY SPRING BOOT BACKEND STARTED!       ⚔️");
        System.out.println("🚀  API URL: http://localhost:8080/api           ");
        System.out.println("📊  H2 Console: http://localhost:8080/h2-console ");
        System.out.println("=================================================");
    }
}
