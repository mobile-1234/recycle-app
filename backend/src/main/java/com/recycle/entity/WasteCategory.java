package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 废品分类表
 */
@Data
@TableName("waste_categories")
public class WasteCategory {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private String code;

    private String icon;

    private Long parentId;

    private BigDecimal pricePerKg;

    private Integer pointsPerKg;

    private BigDecimal carbonPerKg;

    private String description;

    private String tips;

    private String recyclingInfo;

    private Integer sortOrder;

    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
