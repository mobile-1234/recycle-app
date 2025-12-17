package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("risk_assessments")
public class RiskAssessment {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long regionId;
    private String riskType;
    private String level;
    private String title;
    private String content;
    private String impact;
    private Integer probability;
    private String strategy;
    private String status;
    private LocalDateTime createdAt;
}
