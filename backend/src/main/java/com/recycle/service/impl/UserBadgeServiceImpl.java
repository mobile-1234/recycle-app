package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.UserBadge;
import com.recycle.mapper.UserBadgeMapper;
import com.recycle.service.UserBadgeService;
import org.springframework.stereotype.Service;

@Service
public class UserBadgeServiceImpl extends ServiceImpl<UserBadgeMapper, UserBadge> implements UserBadgeService {
}
