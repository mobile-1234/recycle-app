package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("business_orders")
public class BusinessOrder {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String orderNo;
    private Long enterpriseId;
    private Long consumerOrderId;
    private String customerName;
    private String customerPhone;
    private String categoryName;
    private BigDecimal weight;
    private BigDecimal estimatedValue;
    private String area;
    private String address;
    private Long collectorId;
    private String collectorName;
    private String collectorPhone;
    private BigDecimal settlementAmount;
    private String settlementStatus;
    private String status;
    private LocalDateTime createdAt;
}
