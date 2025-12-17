package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("customer_service_messages")
public class CustomerServiceMessage {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long sessionId;
    private String senderType;
    private Long senderId;
    private String content;
    private String contentType;
    private LocalDateTime createdAt;
}
