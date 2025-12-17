package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("enterprise_employees")
public class EnterpriseEmployee {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long enterpriseId;
    private String employeeNo;
    private String name;
    private String phone;
    private String role;
    private String department;
    private String status;
    private LocalDateTime createdAt;
}
