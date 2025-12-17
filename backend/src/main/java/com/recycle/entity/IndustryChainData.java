package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("industry_chain_data")
public class IndustryChainData {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long regionId;
    private String stage;
    private LocalDate reportDate;
    private BigDecimal volume;
    private BigDecimal efficiency;
    private Integer companies;
    private Integer employees;
    private BigDecimal revenue;
    private BigDecimal growthRate;
    private LocalDateTime createdAt;
}
