package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("statistics_reports")
public class StatisticsReport {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long enterpriseId;
    private String reportType;
    private LocalDate reportDate;
    private BigDecimal totalRecycleWeight;
    private BigDecimal totalRevenue;
    private Integer totalOrders;
    private Integer newUsers;
    private BigDecimal carbonReduction;
    private BigDecimal waterSaving;
    private BigDecimal electricitySaving;
    private String categoryData;
    private LocalDateTime createdAt;
}
