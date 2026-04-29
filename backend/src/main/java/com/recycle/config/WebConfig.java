package com.recycle.config;

import com.recycle.interceptor.AuthInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
@SuppressWarnings("unused")
public class WebConfig implements WebMvcConfigurer {

    private final AuthInterceptor authInterceptor;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 🔧 开发环境临时禁用Token验证，便于前端测试
        // 生产环境请启用并配置正确的Token验证
        /*
        registry.addInterceptor(authInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns(
                        // C端接口
                        "/api/c/**",
                        "/api/client/**",
                        // B端接口
                        "/api/b/**",
                        "/api/business/**",
                        // G端接口
                        "/api/g/**",
                        "/api/government/**",
                        // 文档接口
                        "/doc.html",
                        "/swagger-ui/**",
                        "/v3/api-docs/**"
                );
        */
    }
}
