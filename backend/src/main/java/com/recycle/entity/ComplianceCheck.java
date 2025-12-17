package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("compliance_checks")
public class ComplianceCheck {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String checkNo;
    private Long enterpriseId;
    private String enterpriseName;
    private Long regionId;
    private String checkType;
    private LocalDate checkDate;
    private String riskLevel;
    private String riskPattern;
    private String findings;
    private String suggestions;
    private Long inspectorId;
    private String inspectorName;
    private String status;
    private LocalDate rectifyDeadline;
    private LocalDateTime createdAt;
}
