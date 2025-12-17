package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("device_alerts")
public class DeviceAlert {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long deviceId;
    private Long enterpriseId;
    private String type;
    private String level;
    private String title;
    private String description;
    private String status;
    private LocalDateTime createdAt;
}
