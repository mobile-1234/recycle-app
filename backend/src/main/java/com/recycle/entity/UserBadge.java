package com.recycle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("user_badges")
public class UserBadge {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private Long badgeId;
    private LocalDateTime unlockedAt;
}
