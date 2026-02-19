package com.tushar.online.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // Allow your React app to connect
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:5173");

        // Allow all headers and methods (GET, POST, PUT, DELETE, OPTIONS)
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        // Apply this rule to all API endpoints
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
