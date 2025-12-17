package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("enterprise_subscriptions")
public class EnterpriseSubscription {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long enterpriseId;
    private Long planId;
    private String planName;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal amount;
    private Integer maxUsers;
    private Integer usedUsers;
    private String status;
    private LocalDateTime createdAt;
}
