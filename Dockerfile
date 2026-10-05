# ==============================================================================
# Step 1: Backend Dockerfile (Spring Boot 4 + OpenJDK 17)
# Multi-stage build: Builds the JAR, then packages only the lightweight JRE
# ==============================================================================

# Stage 1: Build stage
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copy Maven wrapper and pom.xml first (caches dependencies for faster future builds)
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source code and build the production JAR
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Stage 2: Production Runtime stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy the compiled JAR file from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Spring Boot runs on port 8081
EXPOSE 8081

# Launch the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
