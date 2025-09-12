
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.configs;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import java.util.List;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;

/**
 *
 * @author admin
 */
@Configuration
@EnableTransactionManagement
@EnableWebSecurity
@ComponentScan(basePackages = {
    "com.pdh.controllers",
    "com.pdh.repositories",
    "com.pdh.services",
    "com.pdh.filter",
    "com.pdh.utils",})
@PropertySource("classpath:cloudinary.properties")
public class SpringSecurityConfigs {

    @Autowired
    private UserDetailsService userDetailsService;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public HandlerMappingIntrospector mvcHandlerMappingIntrospector() {
        return new HandlerMappingIntrospector();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws
            Exception {
        http.cors(c -> c.configurationSource(corsConfigurationSource()))
                .csrf(c -> c.disable()).authorizeHttpRequests(requests -> requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/secure/payment/callback/momo/redirect").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/secure/**").authenticated()
                .requestMatchers("/api/**").permitAll()
                .anyRequest().permitAll())
                .formLogin(form -> form
                    .loginProcessingUrl("/admin/login")   
                    .loginPage("/admin/login")
                    .defaultSuccessUrl("/admin/dashboard", true)
                    .failureUrl("/admin/login?error=true")
                    .permitAll())
                .logout(logout -> logout
                    .logoutUrl("/admin/logout")
                    .logoutSuccessUrl("/admin/login?logout=true")
                    .permitAll());
        return http.build();
    }

    @Bean
    public Cloudinary cloudinary(Environment env) {
        String cloudName = env.getProperty("cloudinary.cloud_name");
        String apiKey = env.getProperty("cloudinary.api_key");
        String apiSecret = env.getProperty("cloudinary.api_secret");
        boolean secure = Boolean.parseBoolean(env.getProperty("cloudinary.secure", "true"));

        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", secure
        ));
    }

    @Bean
    @Order(0)
    public StandardServletMultipartResolver multipartResolver() {
        return new StandardServletMultipartResolver();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
