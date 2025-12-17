package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("policy_simulations")
public class PolicySimulation {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private String simulationType;
    private String parameters;
    private BigDecimal subsidyAmount;
    private Integer timeRange;
    private String result;
    private BigDecimal recycleIncrease;
    private BigDecimal budgetCost;
    private BigDecimal carbonReduction;
    private BigDecimal participation;
    private LocalDateTime createdAt;
}
