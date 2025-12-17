package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.MonitoringLocation;
import com.recycle.mapper.MonitoringLocationMapper;
import com.recycle.service.MonitoringLocationService;
import org.springframework.stereotype.Service;

@Service
public class MonitoringLocationServiceImpl extends ServiceImpl<MonitoringLocationMapper, MonitoringLocation> implements MonitoringLocationService {
}
