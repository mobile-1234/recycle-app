package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("invite_records")
public class InviteRecord {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long inviterId;
    private Long inviteeId;
    private String inviteeNickname;
    private String inviteeAvatar;
    private String status;
    private Integer rewardPoints;
    private Integer completedOrders;
    private LocalDateTime inviteTime;
    private LocalDateTime successTime;
}
