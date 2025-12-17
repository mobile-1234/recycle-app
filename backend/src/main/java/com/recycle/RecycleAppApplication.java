package com.recycle;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.recycle.mapper")
public class RecycleAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(RecycleAppApplication.class, args);
    }
}
