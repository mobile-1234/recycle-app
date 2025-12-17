package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("region_statistics")
public class RegionStatistics {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long regionId;
    private String regionName;
    private LocalDate statDate;
    private String statType;
    private BigDecimal recycleVolume;
    private BigDecimal recycleRate;
    private BigDecimal regenerationRate;
    private BigDecimal accuracyRate;
    private BigDecimal marketPrice;
    private Integer companies;
    private BigDecimal carbonReduction;
    private String trend;
    private LocalDateTime createdAt;
}
