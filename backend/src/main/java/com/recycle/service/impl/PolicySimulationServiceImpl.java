package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.PolicySimulation;
import com.recycle.mapper.PolicySimulationMapper;
import com.recycle.service.PolicySimulationService;
import org.springframework.stereotype.Service;

@Service
public class PolicySimulationServiceImpl extends ServiceImpl<PolicySimulationMapper, PolicySimulation> implements PolicySimulationService {
}
