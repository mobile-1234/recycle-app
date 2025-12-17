package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("donation_projects")
public class DonationProject {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String description;
    private String image;
    private BigDecimal targetAmount;
    private BigDecimal currentAmount;
    private Integer donorCount;
    private Integer status;
    private LocalDateTime createdAt;
}
