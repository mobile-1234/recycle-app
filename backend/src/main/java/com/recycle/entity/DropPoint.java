package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 投递点表
 */
@Data
@TableName("drop_points")
public class DropPoint {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private String address;

    private String phone;

    private BigDecimal longitude;

    private BigDecimal latitude;

    private BigDecimal rating;

    private Integer capacity;

    private String supportedTypes;

    private String workingHours;

    private String features;

    private String status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
