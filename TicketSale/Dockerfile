# ============================================================
# Stage 1: Build WAR
# ============================================================
FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline -B

COPY src ./src

RUN mvn clean package -DskipTests


# ============================================================
# Stage 2: Run WAR with Tomcat
# ============================================================
FROM tomcat:10.1-jdk17-temurin

# Remove default Tomcat applications
RUN rm -rf /usr/local/tomcat/webapps/*

# Deploy TicketSale WAR
COPY --from=build /app/target/TicketSale-1.0-SNAPSHOT.war \
    /usr/local/tomcat/webapps/TicketSale.war

EXPOSE 8080

CMD ["catalina.sh", "run"]