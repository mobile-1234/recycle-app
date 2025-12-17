package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("login_logs")
public class LoginLog {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private Long enterpriseId;
    private LocalDateTime loginTime;
    private String ip;
    private String location;
    private String device;
    private String browser;
    private String status;
    private String failReason;
}
