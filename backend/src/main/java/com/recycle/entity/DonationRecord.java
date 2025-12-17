package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("donation_records")
public class DonationRecord {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private Long projectId;
    private String projectName;
    private BigDecimal amount;
    private Integer rewardPoints;
    private BigDecimal rewardCarbon;
    private String status;
    private LocalDateTime createdAt;
}
