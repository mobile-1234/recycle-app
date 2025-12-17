package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("government_operation_logs")
public class GovernmentOperationLog {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private String userName;
    private String module;
    private String action;
    private String targetType;
    private Long targetId;
    private String detail;
    private String ip;
    private String userAgent;
    private LocalDateTime createdAt;
}
