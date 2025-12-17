package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.PolicyEvaluation;
import com.recycle.mapper.PolicyEvaluationMapper;
import com.recycle.service.PolicyEvaluationService;
import org.springframework.stereotype.Service;

@Service
public class PolicyEvaluationServiceImpl extends ServiceImpl<PolicyEvaluationMapper, PolicyEvaluation> implements PolicyEvaluationService {
}
