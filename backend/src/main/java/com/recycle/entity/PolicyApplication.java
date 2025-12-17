package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("policy_applications")
public class PolicyApplication {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long enterpriseId;
    private Long policyId;
    private String policyTitle;
    private String materials;
    private String status;
    private LocalDateTime submitAt;
    private LocalDateTime resultAt;
    private String remark;
    private LocalDateTime createdAt;
}
