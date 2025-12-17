package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("policies")
public class Policy {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String title;
    private String description;
    private String issuer;
    private String amountRange;
    private LocalDate deadline;
    private String requirements;
    private String status;
    private LocalDateTime createdAt;
}
