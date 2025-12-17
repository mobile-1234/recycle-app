package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.PolicyApplication;
import com.recycle.mapper.PolicyApplicationMapper;
import com.recycle.service.PolicyApplicationService;
import org.springframework.stereotype.Service;

@Service
public class PolicyApplicationServiceImpl extends ServiceImpl<PolicyApplicationMapper, PolicyApplication> implements PolicyApplicationService {
}
