package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.SubscriptionPlan;
import com.recycle.mapper.SubscriptionPlanMapper;
import com.recycle.service.SubscriptionPlanService;
import org.springframework.stereotype.Service;

@Service
public class SubscriptionPlanServiceImpl extends ServiceImpl<SubscriptionPlanMapper, SubscriptionPlan> implements SubscriptionPlanService {
}
