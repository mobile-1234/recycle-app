package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("customer_service_sessions")
public class CustomerServiceSession {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime closedAt;
}
