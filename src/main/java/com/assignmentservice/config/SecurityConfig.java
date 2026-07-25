package com.assignmentservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.RememberMeServices;
import org.springframework.security.web.authentication.rememberme.TokenBasedRememberMeServices;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final UserDetailsService userDetailsService;

    @Value("${frontend.url}")
    private String frontendUrl;

    public SecurityConfig(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:5174",
                frontendUrl,
                "https://www.assignmentservice.net",
                "https://assignmentservice.net"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers(
                                "/",
                                "/index",
                                "/home",
                                "/about",
                                "/contact",
                                "/register",
                                "/login",
                                "/verify",
                                "/verification-sent",
                                "/resend-verification",
                                "/forgot-password",
                                "/reset-password",

                                "/payment/pay/**",
                                "/payment/notify",
                                "/payment/return",
                                "/payment/cancel",

                                "/privacy",
                                "/privacy.html",
                                "/privacy-policy",
                                "/privacy-policy.html",
                                "/terms",
                                "/terms.html",
                                "/terms-and-conditions",
                                "/terms-and-conditions.html",
                                "/refund",
                                "/refund.html",
                                "/return-policy",
                                "/return-policy.html",

                                "/css/**",
                                "/js/**",
                                "/images/**",
                                "/webjars/**",
                                "/favicon.ico",

                                "/api/public/**",
                                "/api/contact/**",

                                "/feedback/all",
                                "/feedback/view/**",
                                "/feedback/api/public/**",

                                "/error",
                                "/access-denied"
                        ).permitAll()

                        .requestMatchers("/api/auth/**").authenticated()
                        .requestMatchers("/api/user/**").authenticated()

                        .requestMatchers(
                                "/admin/**",
                                "/api/admin/**",
                                "/admin-dashboard",
                                "/admin/assignments/**",
                                "/admin/users/**",
                                "/admin/customers",
                                "/admin/reports",
                                "/admin/management",
                                "/admin/analytics"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                "/payment/checkout"
                        ).authenticated()

                        .requestMatchers(
                                "/profile/**",
                                "/api/profile/**",
                                "/my-account",
                                "/settings"
                        ).authenticated()

                        .requestMatchers(
                                "/assignments/**",
                                "/my-assignments",
                                "/assignment/create",
                                "/assignment/edit/**",
                                "/assignment/view/**"
                        ).authenticated()

                        .requestMatchers(
                                "/feedback/submit",
                                "/feedback/my-feedback",
                                "/feedback/api/recent",
                                "/feedback/api/submit"
                        ).authenticated()

                        .requestMatchers(
                                "/notifications/**",
                                "/api/notifications/**"
                        ).authenticated()

                        .requestMatchers("/dashboard").authenticated()

                        .anyRequest().authenticated()
                )

                .formLogin(form -> form
                        .loginProcessingUrl("/api/auth/login")
                        .successHandler(authenticationSuccessHandler())
                        .failureHandler((request, response, exception) -> {
                            // Return JSON instead of redirecting, so React handles navigation
                            response.setStatus(401);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\":\"Invalid credentials\"}");
                        })
                        .usernameParameter("email")
                        .passwordParameter("password")
                        .permitAll()
                )

                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            // Return JSON instead of redirecting — React handles navigation to /login
                            response.setStatus(200);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"message\":\"Logged out successfully\"}");
                        })
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .deleteCookies("JSESSIONID", "remember-me")
                        .permitAll()
                )

                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                        .maximumSessions(1)
                        .maxSessionsPreventsLogin(false)
                        .expiredUrl(frontendUrl + "/login?expired=true")
                )

                .rememberMe(remember -> remember
                        .rememberMeServices(rememberMeServices())
                        .key("uniqueAndSecretKey")
                        .tokenValiditySeconds(86400)
                        .rememberMeParameter("remember-me")
                )

                .exceptionHandling(exception -> exception
                        // Return JSON for 403s instead of forwarding to a page that
                        // doesn't exist as a controller/view (was causing a masked
                        // 404 instead of the real 403 for React callers).
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(403);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\":\"Access denied\"}");
                        })
                        .authenticationEntryPoint((request, response, authException) -> {
                            String requestURI = request.getRequestURI();
                            if (requestURI.startsWith("/api/") || requestURI.startsWith("/feedback/api/")) {
                                response.setStatus(401);
                                response.setContentType("application/json");
                                response.getWriter().write("{\"error\":\"Unauthorized\"}");
                            } else {
                                String redirectUrl = requestURI;
                                if (request.getQueryString() != null) {
                                    redirectUrl += "?" + request.getQueryString();
                                }
                                response.sendRedirect(frontendUrl + "/login?redirect=" +
                                        java.net.URLEncoder.encode(redirectUrl, "UTF-8"));
                            }
                        })
                )

                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .csrf(csrf -> csrf
                        .ignoringRequestMatchers(
                                "/api/**",
                                "/feedback/**",
                                "/h2-console/**",
                                "/payment/notify",
                                "/logout",
                                "/register",
                                "/forgot-password",
                                "/reset-password",
                                "/resend-verification",
                                "/admin/assignments/*/deliver-solution",
                                "/assignments/*/request-revision"
                        )
                )

                .headers(headers -> headers
                        .contentSecurityPolicy(csp -> csp
                                .policyDirectives("default-src 'self'; " +
                                        "img-src 'self' data: https:; " +
                                        "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
                                        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
                                        "font-src 'self' https://cdn.jsdelivr.net;")
                        )
                        .frameOptions(frame -> frame.sameOrigin())
                );

        return http.build();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring().requestMatchers(
                "/resources/**",
                "/static/**",
                "/uploads/**",
                "/h2-console/**",
                "/swagger-ui/**",
                "/v3/api-docs/**",
                "/swagger-resources/**",
                "/actuator/health",
                "/actuator/info"
        );
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        authProvider.setHideUserNotFoundExceptions(false);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public RememberMeServices rememberMeServices() {
        TokenBasedRememberMeServices rememberMeServices =
                new TokenBasedRememberMeServices("uniqueAndSecretKey", userDetailsService);
        rememberMeServices.setAlwaysRemember(false);
        rememberMeServices.setTokenValiditySeconds(86400);
        rememberMeServices.setParameter("remember-me");
        return rememberMeServices;
    }

    @Bean
    public AuthenticationSuccessHandler authenticationSuccessHandler() {
        return (request, response, authentication) -> {
            // Return JSON instead of redirecting — React handles navigation
            boolean isAdmin = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .anyMatch(a -> a.equals("ROLE_ADMIN"));

            String redirectPath = isAdmin ? "/admin/dashboard" : "/dashboard";

            response.setStatus(200);
            response.setContentType("application/json");
            response.getWriter().write("{\"role\":\"" + (isAdmin ? "ADMIN" : "USER") + "\",\"redirect\":\"" + redirectPath + "\"}");
        };
    }
}