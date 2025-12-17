package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("activities")
public class Activity {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String title;
    private String description;
    private String content;
    private String image;
    private String tag;
    private String type;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer rewardPoints;
    private BigDecimal rewardCash;
    private Integer sortOrder;
    private Integer status;
    private LocalDateTime createdAt;
}
