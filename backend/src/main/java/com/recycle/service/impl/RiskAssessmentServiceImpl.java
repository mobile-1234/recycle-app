package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.RiskAssessment;
import com.recycle.mapper.RiskAssessmentMapper;
import com.recycle.service.RiskAssessmentService;
import org.springframework.stereotype.Service;

@Service
public class RiskAssessmentServiceImpl extends ServiceImpl<RiskAssessmentMapper, RiskAssessment> implements RiskAssessmentService {
}
