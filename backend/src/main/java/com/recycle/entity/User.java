package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 用户表
 */
@Data
@TableName("users")
public class User {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String phone;

    private String password;

    private String nickname;

    private String avatar;

    private Integer avatarIndex;

    private Integer level;

    private String levelName;

    private Integer levelProgress;

    private Integer totalPoints;

    private Integer availablePoints;

    private BigDecimal totalCash;

    private BigDecimal availableCash;

    private BigDecimal totalCarbon;

    private Integer recycleCount;

    private String inviteCode;

    private Long invitedBy;

    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    private LocalDateTime lastLoginAt;
}
