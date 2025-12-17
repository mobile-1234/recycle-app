package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("monitoring_locations")
public class MonitoringLocation {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long enterpriseId;
    private String locationNo;
    private String name;
    private String type;
    private String address;
    private BigDecimal longitude;
    private BigDecimal latitude;
    private BigDecimal capacity;
    private BigDecimal currentVolume;
    private BigDecimal recycleVolume;
    private String status;
    private LocalDateTime lastUpdate;
    private LocalDateTime createdAt;
}
