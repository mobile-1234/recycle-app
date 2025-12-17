package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("devices")
public class Device {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String deviceNo;
    private Long enterpriseId;
    private String name;
    private String type;
    private String model;
    private String location;
    private String status;
    private Integer runningTime;
    private BigDecimal processedVolume;
    private BigDecimal efficiency;
    private BigDecimal temperature;
    private BigDecimal pressure;
    private LocalDate lastMaintenance;
    private LocalDate nextMaintenance;
    private LocalDateTime createdAt;
}
