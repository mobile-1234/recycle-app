package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.Policy;
import com.recycle.mapper.PolicyMapper;
import com.recycle.service.PolicyService;
import org.springframework.stereotype.Service;

@Service
public class PolicyServiceImpl extends ServiceImpl<PolicyMapper, Policy> implements PolicyService {
}
