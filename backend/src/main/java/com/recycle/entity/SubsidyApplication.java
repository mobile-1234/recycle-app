package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("subsidy_applications")
public class SubsidyApplication {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String applicationNo;
    private Long enterpriseId;
    private String enterpriseName;
    private String subsidyType;
    private BigDecimal amount;
    private String purpose;
    private String materials;
    private LocalDate applyDate;
    private String status;
    private String blockchainHash;
    private String blockchainStatus;
    private Long reviewerId;
    private String reviewerName;
    private LocalDateTime reviewTime;
    private String reviewComment;
    private String rejectReason;
    private LocalDateTime createdAt;
}
