package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;

@Data
@TableName("subscription_plans")
public class SubscriptionPlan {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String code;
    private String name;
    private BigDecimal price;
    private String unit;
    private Integer maxUsers;
    private String storageLimit;
    private String features;
    private Integer isPopular;
    private Integer status;
}
