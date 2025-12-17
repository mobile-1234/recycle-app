package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("government_warnings")
public class GovernmentWarning {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String warningNo;
    private String type;
    private String level;
    private String title;
    private String content;
    private Long regionId;
    private String regionName;
    private Long enterpriseId;
    private String enterpriseName;
    private String source;
    private String evidence;
    private String status;
    private Long handlerId;
    private String handlerName;
    private LocalDateTime handleTime;
    private String handleResult;
    private LocalDateTime createdAt;
}
