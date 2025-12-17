package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("exchange_records")
public class ExchangeRecord {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private Long productId;
    private String productName;
    private Integer pointsCost;
    private Integer quantity;
    private String status;
    private String shippingAddress;
    private String shippingNo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
