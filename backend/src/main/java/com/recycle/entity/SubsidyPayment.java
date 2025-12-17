package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("subsidy_payments")
public class SubsidyPayment {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String paymentNo;
    private Long applicationId;
    private Long enterpriseId;
    private String enterpriseName;
    private BigDecimal amount;
    private String purpose;
    private LocalDate paymentDate;
    private String paymentMethod;
    private String bankAccount;
    private Integer effectiveness;
    private String status;
    private LocalDateTime createdAt;
}
