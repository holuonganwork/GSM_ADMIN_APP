plugins {
    java
    id("org.springframework.boot") version "3.3.4"
    id("io.spring.dependency-management") version "1.1.6"
}

group = "com.greensm"
version = "1.0.0"

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

dependencies {
    // Spring Boot Starters
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")

    // Database
    runtimeOnly("com.h2database:h2")
    runtimeOnly("org.postgresql:postgresql")

    // RabbitMQ Messaging
    implementation("org.springframework.boot:spring-boot-starter-amqp")

    // OpenAPI 3 / Swagger UI
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.6.0")

    // Lombok
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")

    // Jackson JSR310 (Java 8 date/time) - already included in spring-boot-starter-web, but explicit ensures proper serialization
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310")

    // Testing
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

val cleanTestDb = tasks.register<Exec>("cleanTestDb") {
    group = "verification"
    description = "Clean up test data from PostgreSQL gsm_simulator database manually"
    workingDir = rootProject.projectDir.parentFile
    commandLine("cmd", "/c", "clean_test_data.bat")
    isIgnoreExitValue = true
}

tasks.withType<Test> {
    useJUnitPlatform()
}

