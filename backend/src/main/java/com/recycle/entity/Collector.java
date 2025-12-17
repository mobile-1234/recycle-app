package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 回收员表
 */
@Data
@TableName("collectors")
public class Collector {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private String name;

    private String phone;

    private String avatar;

    private String idCard;

    private BigDecimal rating;

    private Integer reviewCount;

    private Integer completedOrders;

    private String experience;

    private String specialties;

    private String serviceArea;

    private String workingHours;

    private String responseTime;

    private String priceRange;

    private String features;

    private String status;

    private BigDecimal longitude;

    private BigDecimal latitude;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
