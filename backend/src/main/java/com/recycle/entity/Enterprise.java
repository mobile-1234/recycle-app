package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 企业表
 */
@Data
@TableName("enterprises")
public class Enterprise {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private String code;

    private String type;

    private String legalPerson;

    private String phone;

    private String email;

    private String address;

    private String registeredCapital;

    private LocalDate establishDate;

    private String logo;

    private Integer status;

    private Integer verified;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
