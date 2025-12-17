package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.EnterpriseSubscription;
import com.recycle.mapper.EnterpriseSubscriptionMapper;
import com.recycle.service.EnterpriseSubscriptionService;
import org.springframework.stereotype.Service;

@Service
public class EnterpriseSubscriptionServiceImpl extends ServiceImpl<EnterpriseSubscriptionMapper, EnterpriseSubscription> implements EnterpriseSubscriptionService {
}
