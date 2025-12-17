package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.RegionStatistics;
import com.recycle.mapper.RegionStatisticsMapper;
import com.recycle.service.RegionStatisticsService;
import org.springframework.stereotype.Service;

@Service
public class RegionStatisticsServiceImpl extends ServiceImpl<RegionStatisticsMapper, RegionStatistics> implements RegionStatisticsService {
}
