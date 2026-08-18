# Multi-stage Dockerfile for Spring Boot Placement Management Backend
# Stage 1: Build stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/placement-management-0.0.1-SNAPSHOT.jar app.jar

ENV SERVER_PORT=8083
EXPOSE 8083

ENTRYPOINT ["java", "-jar", "app.jar"]
