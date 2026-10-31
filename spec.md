# PROJECT SPECIFICATION SHEET

## Project Name: AI Mystery Room

**Project Type:** AI-Powered Web Application  
**Development Approach:** Space-Driven Development (SDD)

### 1. Project Description
AI Mystery Room is an AI-powered interactive mystery investigation platform. Users provide a short scenario, story, or incident description. Based on the input, the AI generates a fictional mystery investigation containing suspects, clues, and supporting evidence.

Users take the role of detectives and investigate the case by examining AI-generated evidence such as WhatsApp conversations, call records, audio recordings or transcripts, witness statements, and other documents. After analyzing the evidence, users must identify and select the actual culprit.

### 2. Problem Statement
Existing mystery-solving games generally provide predefined stories and fixed challenges. They offer limited opportunities for users to create and explore their own mystery scenarios. AI Mystery Room aims to solve this limitation by dynamically generating unique investigation challenges using Artificial Intelligence.

### 3. Project Objectives
- Generate unique mystery investigations based on user input.
- Create multiple fictional suspects with individual backgrounds and motives.
- Generate different types of realistic fictional evidence.
- Provide an interactive investigation environment.
- Allow users to analyze clues and identify the culprit.
- Evaluate the user's decision and provide a detailed explanation.

### 4. Target Users
- Mystery and detective game enthusiasts.
- Students interested in AI-powered applications.
- Users who enjoy logical reasoning and problem-solving.
- General users looking for interactive entertainment.

### 5. Functional Requirements

**FR-01: Scenario Input**
Users can enter a short story, incident, or mystery scenario.

**FR-02: AI Mystery Generation**
The AI analyzes the given scenario and creates a complete fictional investigation.

**FR-03: Suspect Creation**
The system generates multiple suspects with names, backgrounds, motives, and possible connections to the incident.

**FR-04: Evidence Generation**
The AI generates investigation evidence, including:
- WhatsApp-style conversations.
- Fictional audio recordings or transcripts.
- Call records.
- Witness statements.
- Documents and other clues.
- Incident timelines.

**FR-05: Investigation Interface**
Users can access suspect profiles and examine the generated evidence.

**FR-06: Culprit Selection**
Users select the person they believe is responsible for the incident.

**FR-07: Answer Validation**
The backend checks the selected suspect against the actual culprit stored during mystery generation.

**FR-08: Final Explanation**
The system displays the result and explains how the evidence supports the correct answer.

### 6. Non-Functional Requirements
- User-friendly and responsive interface.
- Secure API key management.
- Consistent and logically connected evidence.
- Reliable database storage.
- Efficient AI response handling.
- Protection of the correct answer until submission.

### 7. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js |
| Programming Language | JavaScript |
| Styling | HTML, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| AI Integration | Gemini API |
| Deployment | Vercel, Render |
| Version Control | Git, GitHub |

### 8. Main Modules
1. User Interface Module
2. Scenario Input Module
3. AI Mystery Generation Module
4. Suspect Management Module
5. Evidence Generation Module
6. Investigation Module
7. Culprit Validation Module
8. Result and Explanation Module

### 9. Expected Output
A fully functional AI-powered mystery investigation website where users can create their own mystery challenges, investigate AI-generated evidence, identify the culprit, and receive a final explanation of the case.

### 10. Future Scope
- Multiple difficulty levels.
- Interactive evidence connection board.
- AI-powered hint system.
- Multiplayer investigation.
- Voice-based evidence examination.
- AI-generated crime-scene illustrations.
- Leaderboard and scoring system.

### 11. Project Constraints
- AI-generated evidence must remain consistent with the original scenario.
- Each investigation must have one predefined culprit.
- The correct answer must be securely stored on the backend.
- All generated investigation materials must be fictional and clearly presented as simulated evidence.

### 12. Project Success Criteria
The project is successful when users can submit a scenario, receive a complete AI-generated mystery, investigate multiple evidence types, select a culprit, and receive an accurate result with a logical explanation.