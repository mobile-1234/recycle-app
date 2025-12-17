package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("policy_evaluations")
public class PolicyEvaluation {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long policyId;
    private String policyName;
    private Long regionId;
    private LocalDate evalDate;
    private String evalPeriod;
    private BigDecimal subsidyAmount;
    private BigDecimal recycleGrowth;
    private BigDecimal participationRate;
    private BigDecimal satisfactionRate;
    private BigDecimal costBenefitRatio;
    private String indicators;
    private String recommendations;
    private LocalDateTime createdAt;
}
