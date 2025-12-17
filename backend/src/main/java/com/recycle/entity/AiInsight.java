package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("ai_insights")
public class AiInsight {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long enterpriseId;
    private String type;
    private String title;
    private String description;
    private String icon;
    private String actionUrl;
    private Integer isRead;
    private LocalDateTime createdAt;
}
