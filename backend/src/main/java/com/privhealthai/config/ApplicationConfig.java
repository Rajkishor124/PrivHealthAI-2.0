package com.privhealthai.config;

import com.privhealthai.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Configuration
@EnableJpaAuditing
@RequiredArgsConstructor
public class ApplicationConfig {

    private final UserRepository userRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return phone -> {
            String searchPhone = phone;
            try {
                searchPhone = com.privhealthai.common.util.PhoneNumberUtil.normalizeIndianPhone(phone);
            } catch (Exception ignored) { }
            
            return userRepository.findByPhone(searchPhone)
                    .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with phone: " + phone));
        };
    }
}
