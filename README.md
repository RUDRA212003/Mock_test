<div align="center">
  # 🤖 **Crisp AI Interview Assistant** 🚀
  <p>A Full-Stack Interview Simulation Platform powered by **Crisp AI**.</p>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Badge"/>
  <img src="https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux Badge"/>
  <img src="https://img-shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase Badge"/>
  <img src="https://img.shields.io/badge/Ant_Design-0170FE?style=for-the-badge&logo=ant-design&logoColor=white" alt="Ant Design Badge"/>
</div>

---

## 🌟 **Project Goal**

The **Crisp AI Interview Assistant** is a dual-interface application designed to streamline the technical interview process for **Full-Stack (React/Node)** roles. It provides a real-time, timed interview experience for candidates and a comprehensive evaluation dashboard for interviewers. **All data is persisted locally** using state management for a seamless and uninterrupted user experience.

---

## ✨ **Core Features**

The application is structured into two main, synchronized tabs:

### 👤 **Interviewee Tab (Chat)**

* **Resume Parsing (PDF/DOCX):** Candidates can upload their resume, from which the system automatically extracts **Name, Email, and Phone Number**.
* **Data Validation:** If any essential contact field is missing, the **Crisp AI** chatbot intelligently prompts the candidate to provide it before the interview begins.
* **Timed Interview Simulation:** A structured, dynamic, and timed technical interview based on the selected role (e.g., Full-Stack).
* **Welcome Back Modal:** If a session is unfinished, a modal appears on reload to offer a **pause/resume** option, ensuring progress is never lost.

### 📊 **Interviewer Tab (Dashboard)**

* **Candidate List:** A sortable and searchable list of all candidates, ordered by their final **Crisp AI**-generated score.
* **Detailed View:** Ability to click on any candidate to view a detailed breakdown of their:
    * Complete **Chat History** (Questions and Answers).
    * Extracted **Profile Details**.
    * **Final AI Summary** and Score.

---

## ⚙️ **Interview Flow**

The **Crisp AI**-driven interview follows a strict, progressive format:

| Phase | **Number of Questions** | **Difficulty** | **Time Limit per Question** |
| :---: | :---: | :---: | :---: |
| **Phase 1** | 2 | **Easy** | **20 seconds** |
| **Phase 2** | 2 | **Medium** | **60 seconds** |
| **Phase 3** | 2 | **Hard** | **120 seconds** |

* **Total Questions:** 6
* **Automatic Submission:** When the timer runs out, the current answer is automatically submitted, and the system moves to the next question.
* **Final Assessment:** After the 6th question, **Crisp AI** calculates a **final score** and generates a concise, insightful **summary** of the candidate's performance.

---

## 🛠️ **Tech Stack**

| Category | Technology | Purpose |
| :---: | :---: | :---: |
| **Frontend** | **React** | Core application framework. |
| **State Management** | **Redux** | Centralized state control and logic. |
| **Data Persistence** | **Redux-Persist** / **IndexedDB** | Local, offline data storage for session restoration. |
| **Database** | **Firebase (Authentication/Realtime DB)** | Handles user login and provides a scalable cloud data solution. |
| **UI Library** | **Ant Design (AntD)** | Clean, modern, and responsive UI components. |
| **AI/ML** | Custom API Integration (e.g., Generative AI) | Dynamic question generation, answer judging, scoring, and summary creation. |

---

## 🚀 **Getting Started**

### **Prerequisites**

* **Node.js** (v18+)
* **npm** or **yarn**
* A **Firebase Project** configured with Authentication and a Realtime Database (or Firestore).

### **Installation**

1.  **Clone the repository:**
    ```bash
    git clone [YOUR_REPO_LINK]
    cd ai-interview-assistant
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add your Firebase configuration and AI API key:
    ```
    # Firebase Configuration
    REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
    REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
    REACT_APP_FIREBASE_DATABASE_URL=YOUR_DATABASE_URL
    REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
    # ... other Firebase details

    # AI Service Configuration
    REACT_APP_AI_API_KEY=YOUR_AI_SERVICE_KEY
    ```

4.  **Run the application:**
    ```bash
    npm start
    # or
    yarn start
    ```
    The app will open in your browser, usually at `http://localhost:3000`.

---

## 📝 **Steps to Use This Application**

### **1. User Login**

* Navigate to the application.
* **Log in** using your credentials, which are managed via **Firebase Authentication**.

### **2. Start the Interview (Interviewee Tab)**

* Select the **Interviewee** tab.
* **Upload Resume:**
    * Click the upload button and select a **PDF** (or optional DOCX) file.
    * The system will immediately parse the file for **Name, Email, and Phone Number**.
* **Manual Detail Entry (If Needed):**
    * If any of the core fields are missing (**Name**, **Email**, or **Phone**), the **Crisp AI** chatbot will prompt you to enter the missing information manually, one field at a time.
* **Begin Test:**
    * Once all details are confirmed, **Crisp AI** will initiate the interview for the selected role (**Full-Stack: React/Node**).

### **3. Take the Test**

* Questions will appear sequentially in the chat interface.
* **Answer within the time limit:**
    * **Easy** questions: **20 seconds** ⏳
    * **Medium** questions: **60 seconds** ⏳
    * **Hard** questions: **120 seconds** ⏳
* **Automatic Progression:** The system submits the answer and advances automatically when time expires.
* After the 6th question, the session concludes, and the final assessment is generated.

### **4. View Results (Interviewer Tab)**

* Switch to the **Interviewer** tab.
* View the **list of all candidates**, complete with their **final scores** and **summaries**.
* Use the search bar and sort controls to find specific candidates or order by score.
* Click on a candidate's row to open the detailed view of their full interview history.

---

## 🛑 **Error Handling & Persistence**

* **Invalid File Handling:** Clear error messages are provided for invalid file types or upload failures.
* **Persistence:** All session data (answers, scores, timers, and progress) is saved locally via **Redux-Persist**. If the browser is refreshed or closed:
    1.  The app state is immediately restored upon reopening.
    2.  A "**Welcome Back**" modal appears, allowing the candidate to **resume** their interrupted interview exactly where they left off.

---

## 👨‍💻 **Author & Credits**

* **Created by:** **RUDRESH**
 