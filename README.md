# ⚔️ QUESTIFY — Java Full Stack RPG Gamified Productivity Platform

**Questify** turns your daily tasks, habits, and goals into an immersive RPG adventure. Level up, earn XP, maintain streaks, and claim legendary achievements!

---

## 🌟 What Was Built

### 1. Frontend JavaScript Architecture (`/js` & `/CSS/toast.css`)
- **`js/api.js`**: Universal API service. Auto-detects if the Spring Boot backend (`http://localhost:8080/api`) is running. If online, syncs via REST APIs; if offline (or opened directly via browser `file:///`), smoothly falls back to LocalStorage with rich initial adventurer seed data.
- **`js/toast.js` & `CSS/toast.css`**: RPG-themed toast notification engine and Level-Up / Achievement modal popups.
- **`js/auth.js`**: Form validation, error handling, authentication, and session management for `login.html` and `signup.html`.
- **`js/home.js`**: Live dashboard controller — dynamic level progress bar, remaining XP to next level, streak counter, total XP, and active quests grid.
- **`js/quests.js`**: Interactive objective tracker (Defeat Goblins, Collect Fangs) with clickable progress advancement, victory claiming, and Level Up animations.
- **`js/create.js`**: Quest creator form with a **live interactive preview card** that updates in real time as you type title, description, category, difficulty, XP reward, and quest type.
- **`js/progress.js`**: Analytics dashboard with overall progress percentage, 12-day streak counter, and interactive weekly performance bar charts.
- **`js/achievements.js`**: Achievement Hall with unlocked vs. locked statuses, progress tracking, and reward claims.
- **`js/profile.js`**: Adventurer profile page displaying level, rank, XP, productivity meters, and trophies.
- **`js/settings.js`**: Settings control center for updating username/email, toggling dark mode and animations, configuring alerts, and safe logout.

---

### 2. Spring Boot Backend Architecture (`/backend`)
A production-ready Java Spring Boot REST API built with:
- **Java 17+ & Spring Boot 3.2.3**
- **Spring Web (MVC)** for REST API endpoints
- **Spring Data JPA & Hibernate** for ORM persistence
- **H2 Embedded Database** (Zero-setup in-memory database with web console)
- **CORS Configuration** (`CorsConfig.java`) enabling seamless cross-origin requests from any frontend port or file origin.
- **Data Initializer** (`DataInitializer.java`) that pre-populates initial adventurer data ("Veera", Level 12 Quest Master, default quests, achievements, and weekly activity).

#### Package Structure (`com.questify`):
```
backend/
├── pom.xml
└── src/
    └── main/
        ├── java/com/questify/
        │   ├── QuestifyApplication.java
        │   ├── config/
        │   │   └── CorsConfig.java
        │   ├── controller/
        │   │   ├── AuthController.java
        │   │   ├── QuestController.java
        │   │   ├── UserController.java
        │   │   ├── ProgressController.java
        │   │   ├── AchievementController.java
        │   │   ├── SettingsController.java
        │   │   └── HealthController.java
        │   ├── dto/
        │   │   ├── AuthResponse.java
        │   │   ├── LoginRequest.java
        │   │   ├── SignupRequest.java
        │   │   ├── QuestRequest.java
        │   │   └── ApiResponse.java
        │   ├── model/
        │   │   ├── User.java
        │   │   ├── Quest.java
        │   │   ├── Objective.java
        │   │   ├── Achievement.java
        │   │   ├── UserSetting.java
        │   │   └── WeeklyActivity.java
        │   ├── repository/
        │   │   ├── UserRepository.java
        │   │   ├── QuestRepository.java
        │   │   ├── ObjectiveRepository.java
        │   │   ├── AchievementRepository.java
        │   │   ├── UserSettingRepository.java
        │   │   └── WeeklyActivityRepository.java
        │   └── service/
        │       ├── UserService.java
        │       ├── QuestService.java
        │       ├── AchievementService.java
        │       ├── ProgressService.java
        │       └── DataInitializer.java
        └── resources/
            ├── application.properties
            └── static/               <-- Embedded full frontend bundle
```

---

## 🚀 How to Run

### Option A: Preview Frontend Immediately
You can double-click or open any `.html` file (e.g. `index.html` or `home.html`) in your browser right now!
All pages are fully interactive, validate inputs, create quests, and store progress locally.

### Option B: Run Full Stack with Spring Boot

1. **Open a terminal in the backend directory**:
   ```bash
   cd "E:\UIUX PROJECT\QUESTIFY\backend"
   ```

2. **Run Spring Boot**:
   ```bash
   mvn spring-boot:run
   ```
   *(Or open `backend/pom.xml` in IntelliJ IDEA, Eclipse, or VS Code and run `QuestifyApplication.java`)*

3. **Access the Application**:
   - **Full Stack App**: [http://localhost:8080/index.html](http://localhost:8080/index.html)
   - **REST API Base**: [http://localhost:8080/api](http://localhost:8080/api)
   - **API Health Check**: [http://localhost:8080/api/health](http://localhost:8080/api/health)
   - **H2 Database Console**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
     - JDBC URL: `jdbc:h2:mem:questifydb`
     - User Name: `sa`
     - Password: *(leave blank)*

---

## 📡 REST API Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Check backend server status |
| `POST` | `/api/auth/login` | Login adventurer |
| `POST` | `/api/auth/signup` | Register new adventurer account |
| `GET` | `/api/user/profile` | Get current user profile and stats |
| `PUT` | `/api/user/profile` | Update profile information |
| `GET` | `/api/quests` | Retrieve all quests |
| `GET` | `/api/quests/{id}` | Retrieve single quest details |
| `POST` | `/api/quests` | Create a new custom quest |
| `POST` | `/api/quests/{id}/complete` | Mark quest as completed and award XP |
| `PUT` | `/api/quests/{qId}/objectives/{oId}` | Update objective progress count |
| `GET` | `/api/progress/stats` | Overall progress, streak, and level stats |
| `GET` | `/api/progress/weekly` | Weekly performance chart data |
| `GET` | `/api/achievements` | List all achievements and statuses |
| `POST` | `/api/achievements/{id}/claim` | Claim an unlocked achievement |
| `GET` | `/api/settings` | Get user settings and preferences |
| `PUT` | `/api/settings` | Save user settings |
