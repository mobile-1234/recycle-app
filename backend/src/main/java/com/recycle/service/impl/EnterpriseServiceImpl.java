package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.Enterprise;
import com.recycle.mapper.EnterpriseMapper;
import com.recycle.service.EnterpriseService;
import org.springframework.stereotype.Service;

@Service
public class EnterpriseServiceImpl extends ServiceImpl<EnterpriseMapper, Enterprise> implements EnterpriseService {
}
