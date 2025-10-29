
FROM openjdk:11-jdk-slim
WORKDIR /app
COPY target/backend-app.jar /app/backend-app.jar

# Expose port 8080 for the backend service
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "backend-app.jar"]
