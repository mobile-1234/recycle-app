package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("device_maintenance")
public class DeviceMaintenance {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long deviceId;
    private Long enterpriseId;
    private String type;
    private String title;
    private String description;
    private BigDecimal cost;
    private String technician;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private LocalDateTime createdAt;
}
