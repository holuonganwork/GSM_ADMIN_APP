package com.greensm.compliance.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("GSM Compliance & Fraud Investigation API")
                .version("1.0.0")
                .description("Cổng Kiểm Soát Tuân Thủ & Thẩm Định Giải Trình Gian Lận GSM (Green SM Operations Portal)")
                .contact(new Contact()
                    .name("Ban Kiểm Soát Tuân Thủ GSM")
                    .email("compliance@greensm.vn")))
            .servers(List.of(
                new Server().url("/api").description("Default Local Base URL")
            ));
    }
}
