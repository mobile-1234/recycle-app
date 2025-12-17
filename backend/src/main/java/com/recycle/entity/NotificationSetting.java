package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("notification_settings")
public class NotificationSetting {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private Integer systemAlerts;
    private Integer dataReports;
    private Integer policyUpdates;
    private Integer emailNotifications;
    private String email;
    private Integer smsNotifications;
    private String phone;
    private LocalDateTime updatedAt;
}
