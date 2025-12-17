package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("administrative_regions")
public class AdministrativeRegion {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String regionCode;
    private String name;
    private Long parentId;
    private Integer level;
    private String manager;
    private String contact;
    private String address;
    private Integer population;
    private BigDecimal areaSize;
    private Integer recyclePoints;
    private BigDecimal complianceRate;
    private BigDecimal monthlyVolume;
    private BigDecimal longitude;
    private BigDecimal latitude;
    private String status;
    private LocalDateTime createdAt;
}
