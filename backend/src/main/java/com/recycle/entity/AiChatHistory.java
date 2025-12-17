package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("ai_chat_history")
public class AiChatHistory {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long enterpriseId;
    private Long userId;
    private String sessionId;
    private String role;
    private String content;
    private String attachments;
    private LocalDateTime createdAt;
}
