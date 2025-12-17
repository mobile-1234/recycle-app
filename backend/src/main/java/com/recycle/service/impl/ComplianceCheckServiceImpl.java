package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.ComplianceCheck;
import com.recycle.mapper.ComplianceCheckMapper;
import com.recycle.service.ComplianceCheckService;
import org.springframework.stereotype.Service;

@Service
public class ComplianceCheckServiceImpl extends ServiceImpl<ComplianceCheckMapper, ComplianceCheck> implements ComplianceCheckService {
}
