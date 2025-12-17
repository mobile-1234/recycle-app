package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("scan_history")
public class ScanHistory {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private String detectedClass;
    private String itemName;
    private String category;
    private Integer confidence;
    private Integer points;
    private String image;
    private String bbox;
    private LocalDateTime createdAt;
}
