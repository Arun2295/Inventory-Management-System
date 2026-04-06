package com.example.inventory_management_system.Config;

import com.example.inventory_management_system.Security.JwtFilter;
import com.example.inventory_management_system.Security.ImplementUserDetails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private ImplementUserDetails userDetailsService;

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/products/**").hasRole("ADMIN")
                        .requestMatchers("/api/customers/**").hasAnyRole("ADMIN","SALES_EXECUTIVE")
                        .requestMatchers("/api/suppliers/**").hasAnyRole("ADMIN","PURCHASE_MANAGER")
                        .requestMatchers("/api/sales-orders/**").hasAnyRole("ADMIN","SALES_EXECUTIVE")
                        .requestMatchers("/api/purchase-orders/**").hasAnyRole("ADMIN","PURCHASE_MANAGER")
                        .requestMatchers("/api/grns/**").hasAnyRole("ADMIN","PURCHASE_MANAGER","INVENTORY_MANAGER")
                        .requestMatchers("/api/invoices/**").hasAnyRole("ADMIN","SALES_EXECUTIVE","ACCOUNTANT")
                        .requestMatchers("/api/dashboard/**").hasAnyRole("ADMIN","ACCOUNTANT")
                        .anyRequest().authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();

    }
}
