package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 收益记录表
 */
@Data
@TableName("earnings")
public class Earning {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private Long orderId;

    private String type;

    private BigDecimal cashAmount;

    private Integer pointsAmount;

    private BigDecimal carbonReduction;

    private String category;

    private String description;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
