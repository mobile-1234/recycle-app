package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("recycle_stations")
public class RecycleStation {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String stationNo;
    private String name;
    private String type;
    private Long regionId;
    private String address;
    private BigDecimal longitude;
    private BigDecimal latitude;
    private String operatorName;
    private Long operatorId;
    private String contactName;
    private String contactPhone;
    private String workingHours;
    private String supportedTypes;
    private BigDecimal dailyCapacity;
    private BigDecimal todayVolume;
    private String complianceStatus;
    private LocalDate lastInspection;
    private String status;
    private LocalDateTime createdAt;
}
