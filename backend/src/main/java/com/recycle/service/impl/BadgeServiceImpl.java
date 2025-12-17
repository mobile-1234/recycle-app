package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.Badge;
import com.recycle.mapper.BadgeMapper;
import com.recycle.service.BadgeService;
import org.springframework.stereotype.Service;

@Service
public class BadgeServiceImpl extends ServiceImpl<BadgeMapper, Badge> implements BadgeService {
}
