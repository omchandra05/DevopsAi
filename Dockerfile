# --- Stage 1: Build the Code (Maven) ---
FROM maven:3.9.6-eclipse-temurin-11 AS build
WORKDIR /app

# Copy all your project files into the builder
COPY . .

# Run the build (this creates target/chatbot.war)
RUN mvn clean package -DskipTests

# --- Stage 2: Run the App (Tomcat) ---
FROM tomcat:9.0-jdk11-openjdk-slim

# Copy ONLY the built WAR file from the first stage
# We rename it to ROOT.war so your app runs at the root URL (localhost:8080/)
COPY --from=build /app/target/chatbot.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080
CMD ["catalina.sh", "run"]