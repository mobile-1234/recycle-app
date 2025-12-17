package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 商品表
 */
@Data
@TableName("products")
public class Product {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private String category;

    private String image;

    private String description;

    private Integer pointsPrice;

    private BigDecimal cashPrice;

    private BigDecimal marketPrice;

    private Integer stock;

    private Integer sales;

    private String tag;

    private Integer sortOrder;

    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
