package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("category_statistics")
public class CategoryStatistics {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long regionId;
    private String category;
    private LocalDate statDate;
    private String statType;
    private BigDecimal volume;
    private BigDecimal value;
    private BigDecimal recycleRate;
    private BigDecimal regenerationRate;
    private Integer companies;
    private String marketDemand;
    private String trend;
    private LocalDateTime createdAt;
}
