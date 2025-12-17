package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("ai_generated_reports")
public class AiGeneratedReport {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String reportNo;
    private String reportType;
    private String title;
    private String summary;
    private String content;
    private Long regionId;
    private Long generatorId;
    private LocalDateTime generateTime;
    private String status;
    private LocalDateTime createdAt;
}
