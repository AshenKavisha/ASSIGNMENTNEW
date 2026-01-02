package com.assignmentservice.config;

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
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.RememberMeServices;
import org.springframework.security.web.authentication.rememberme.TokenBasedRememberMeServices;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final UserDetailsService userDetailsService;

    public SecurityConfig(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authz -> authz
                        // Public endpoints - accessible without authentication
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

                                // Static resources
                                "/css/**",
                                "/js/**",
                                "/images/**",
                                "/webjars/**",
                                "/favicon.ico",

                                // Public API endpoints
                                "/api/public/**",

                                // ⭐ ADDED: Contact Form API - Allow contact form submissions
                                "/api/contact/**",

                                // Feedback pages
                                "/feedback/all",
                                "/feedback/view/**",

                                // Error pages
                                "/error",
                                "/access-denied"
                        ).permitAll()

                        // Admin endpoints - require ADMIN role
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

                        // User profile endpoints - require authentication
                        .requestMatchers(
                                "/profile/**",
                                "/api/profile/**",
                                "/my-account",
                                "/settings"
                        ).authenticated()

                        // Assignment endpoints - require authentication
                        .requestMatchers(
                                "/assignments/**",
                                "/my-assignments",
                                "/assignment/create",
                                "/assignment/edit/**",
                                "/assignment/view/**"
                        ).authenticated()

                        // Feedback submission - require authentication
                        .requestMatchers(
                                "/feedback/submit",
                                "/feedback/my-feedback"
                        ).authenticated()

                        // Notification endpoints - require authentication (FIXED - moved before anyRequest)
                        .requestMatchers(
                                "/notifications/**",
                                "/api/notifications/**"
                        ).authenticated()

                        // Dashboard - require authentication
                        .requestMatchers("/dashboard").authenticated()

                        // All other requests require authentication
                        .anyRequest().authenticated()
                )

                // Form login configuration
                .formLogin(form -> form
                        .loginPage("/login")
                        .loginProcessingUrl("/login")
                        .defaultSuccessUrl("/dashboard", true)
                        .successHandler(authenticationSuccessHandler())
                        .failureUrl("/login?error=true")
                        .usernameParameter("email")
                        .passwordParameter("password")
                        .permitAll()
                )

                // Logout configuration
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout=true")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .deleteCookies("JSESSIONID", "remember-me")
                        .permitAll()
                )

                // Session management
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                        .maximumSessions(1)
                        .maxSessionsPreventsLogin(false)
                        .expiredUrl("/login?expired=true")
                )

                // Remember me configuration
                .rememberMe(remember -> remember
                        .rememberMeServices(rememberMeServices())
                        .key("uniqueAndSecretKey")
                        .tokenValiditySeconds(86400) // 24 hours
                        .rememberMeParameter("remember-me")
                )

                // Exception handling
                .exceptionHandling(exception -> exception
                        .accessDeniedPage("/access-denied")
                        .authenticationEntryPoint((request, response, authException) -> {
                            // Redirect to login with redirect parameter
                            String redirectUrl = request.getRequestURI();
                            if (request.getQueryString() != null) {
                                redirectUrl += "?" + request.getQueryString();
                            }
                            response.sendRedirect("/login?redirect=" + java.net.URLEncoder.encode(redirectUrl, "UTF-8"));
                        })
                )

                // CORS configuration
                .cors(cors -> cors.configure(http))

                // CSRF configuration (enabled for forms, disabled for APIs if needed)
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers(
                                "/api/**",  // Disable CSRF for APIs if using token-based auth
                                "/h2-console/**"
                        )
                )

                // Headers security
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
                // Ignore static resources
                "/resources/**",
                "/static/**",
                "/uploads/**",

                // H2 Console (for development only - remove in production)
                "/h2-console/**",

                // Swagger UI (if using)
                "/swagger-ui/**",
                "/v3/api-docs/**",
                "/swagger-resources/**",

                // Health check endpoints
                "/actuator/health",
                "/actuator/info"
        );
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        authProvider.setHideUserNotFoundExceptions(false); // Show proper error messages
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
        rememberMeServices.setTokenValiditySeconds(86400); // 24 hours
        rememberMeServices.setParameter("remember-me");
        return rememberMeServices;
    }

    @Bean
    public AuthenticationSuccessHandler authenticationSuccessHandler() {
        return (request, response, authentication) -> {
            // Update last login time
            if (authentication != null && authentication.isAuthenticated()) {
                // You can add custom logic here, e.g., update user's last login
            }

            // Check if there's a redirect URL in session
            String redirectUrl = (String) request.getSession().getAttribute("redirectUrl");
            if (redirectUrl != null && !redirectUrl.isEmpty()) {
                request.getSession().removeAttribute("redirectUrl");
                response.sendRedirect(redirectUrl);
            } else {
                // Default redirect
                response.sendRedirect("/dashboard");
            }
        };
    }
}