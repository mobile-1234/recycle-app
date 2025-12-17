package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("business_todos")
public class BusinessTodo {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long enterpriseId;
    private String title;
    private String description;
    private String type;
    private String icon;
    private Integer count;
    private String priority;
    private String actionUrl;
    private String status;
    private LocalDateTime createdAt;
}
