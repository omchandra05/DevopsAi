# 1. Use Tomcat 9 with Java 11
FROM tomcat:9.0-jdk11-openjdk

# 2. Clear default Tomcat apps (Manager, Docs, etc.)
RUN rm -rf /usr/local/tomcat/webapps/*

# 3. COPY YOUR SPECIFIC FILE
# We take 'target/chatbot.war' and rename it to 'ROOT.war' inside the container.
# This makes your app available at localhost:8080 (without /chatbot/)
COPY target/chatbot.war /usr/local/tomcat/webapps/ROOT.war

# 4. Expose Port
EXPOSE 8080

# 5. Run
CMD ["catalina.sh", "run"]