package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("order_reviews")
public class OrderReview {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long orderId;
    private Long userId;
    private Long collectorId;
    private Integer rating;
    private String content;
    private String images;
    private String tags;
    private Integer isAnonymous;
    private String reply;
    private LocalDateTime replyTime;
    private LocalDateTime createdAt;
}
