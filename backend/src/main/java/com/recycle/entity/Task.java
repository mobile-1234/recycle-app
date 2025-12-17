package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("tasks")
public class Task {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String description;
    private String type;
    private String icon;
    private Integer rewardPoints;
    private Integer targetCount;
    private String action;
    private Integer sortOrder;
    private Integer status;
    private LocalDateTime createdAt;
}
