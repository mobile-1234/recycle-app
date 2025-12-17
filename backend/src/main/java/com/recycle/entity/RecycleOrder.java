package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 回收订单表
 */
@Data
@TableName("recycle_orders")
public class RecycleOrder {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String orderNo;

    private Long userId;

    private Long collectorId;

    private Long dropPointId;

    private Long categoryId;

    private String categoryName;

    private String recycleMethod;

    private BigDecimal weight;

    private BigDecimal estimatedWeight;

    private BigDecimal pricePerKg;

    private BigDecimal cashAmount;

    private Integer pointsAmount;

    private BigDecimal carbonReduction;

    private String contactName;

    private String contactPhone;

    private String address;

    private LocalDate scheduledDate;

    private String scheduledTime;

    private String timeOption;

    private String notes;

    private String photos;

    private String additionalServices;

    private BigDecimal serviceFee;

    private String status;

    private String cancelReason;

    private LocalDateTime completedAt;

    private Integer rated;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
