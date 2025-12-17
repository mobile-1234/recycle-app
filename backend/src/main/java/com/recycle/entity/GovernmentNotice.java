package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("government_notices")
public class GovernmentNotice {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String title;
    private String content;
    private String type;
    private String level;
    private String targetRegions;
    private String attachment;
    private Long publisherId;
    private String publisherName;
    private LocalDateTime publishTime;
    private LocalDateTime expireTime;
    private String status;
    private Integer viewCount;
    private LocalDateTime createdAt;
}
