package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 政府用户表
 */
@Data
@TableName("government_users")
public class GovernmentUser {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String username;

    private String password;

    private String name;

    private String department;

    private String position;

    private String phone;

    private String email;

    private String avatar;

    private String role;

    private Long regionId;

    private String permissions;

    private Integer status;

    private LocalDateTime lastLoginAt;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
