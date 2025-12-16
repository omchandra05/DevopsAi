<div align="center">

# 🧠 Gemini Neural Interface
### A Full-Stack AI Chatbot with Dynamic Personas & 3D UI

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)

<br />

<img src="./screenshot.png" alt="Project Screenshot" width="800" style="border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">

<br />
<br />

A robust, containerized AI Chatbot application bridging a **Java Backend (Tomcat 9)** with a **Cyberpunk Frontend**. Powered by Google's **Gemini 1.5 Flash** model, it features real-time dynamic system instructions, allowing the AI to switch personas (e.g., Pirate, Chef, DevOps Expert) instantly.

[View Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## ⚡ Features

* **🎨 Cyberpunk UI:** Glassmorphism design with a 3D animated background powered by **Three.js**.
* **🤖 Dynamic Personas:** Change the AI's personality (System Instruction) on the fly without restarting the server.
* **🐳 Fully Dockerized:** Ready-to-deploy container with multi-stage builds (Maven Build + Tomcat Run).
* **🔌 Java Backend:** Secure Servlet-based architecture acting as an API Gateway to Google Gemini.
* **🚀 Context-Aware:** Custom "Typing..." animations and responsive chat bubbles.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Backend** | Java 11, Jakarta EE Servlets, Apache Maven |
| **Frontend** | HTML5, CSS3 (Glassmorphism), Vanilla JS, Three.js |
| **Server** | Apache Tomcat 9 |
| **AI Model** | Google Gemini 1.5 Flash API |
| **DevOps** | Docker, Docker Compose |

---

## 🚀 Getting Started

### Prerequisites

* **Docker Desktop** (Recommended)
* **Google Gemini API Key** (Get one [here](https://aistudio.google.com/))

### Option 1: Run with Docker (Fastest)

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/gemini-chatbot.git](https://github.com/YOUR_USERNAME/gemini-chatbot.git)
    cd gemini-chatbot
    ```

2.  **Build the Image**
    ```bash
    docker build -t gemini-chatbot .
    ```

3.  **Run the Container**
    Replace `YOUR_API_KEY` with your actual key starting with `AIza...`.
    ```bash
    docker run -d -p 8080:8080 \
      -e GEMINI_API_KEY="YOUR_API_KEY" \
      --name my-chatbot gemini-chatbot
    ```

4.  **Open the App**
    Visit `http://localhost:8080` in your browser.

---

### Option 2: Run Manually (Local Dev)

If you want to develop without Docker, you need **Java 11** and **Maven** installed.

1.  **Set your API Key**
    * **Windows:** `set GEMINI_API_KEY=your_key_here`
    * **Mac/Linux:** `export GEMINI_API_KEY=your_key_here`

2.  **Build and Run**
    ```bash
    mvn clean package
    mvn tomcat7:run
    ```

---

## 📂 Project Structure

```text
gemini-chatbot/
├── src/
│   ├── main/
│   │   ├── java/com/chatbot/   # Java Servlet Logic (Backend)
│   │   └── webapp/             # HTML, CSS, JS, Assets (Frontend)
├── Dockerfile                  # Multi-stage Docker build instruction
├── pom.xml                     # Maven Dependencies
└── README.md                   # Documentation



📸 Screenshots
<div align="center"> <img src="https://www.google.com/search?q=https://via.placeholder.com/400x200%3Ftext%3DMobile%2BResponsive" alt="Mobile View" width="45%"> <img src="https://www.google.com/search?q=https://via.placeholder.com/400x200%3Ftext%3DSettings%2BPanel" alt="Settings Panel" width="45%"> </div>

🤝 Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License
Distributed under the MIT License. See LICENSE for more information.

<div align="center"> Made with ❤️ by <b>Om Chandra</b> </div>