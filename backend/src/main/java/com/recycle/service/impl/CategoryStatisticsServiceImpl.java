package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.CategoryStatistics;
import com.recycle.mapper.CategoryStatisticsMapper;
import com.recycle.service.CategoryStatisticsService;
import org.springframework.stereotype.Service;

@Service
public class CategoryStatisticsServiceImpl extends ServiceImpl<CategoryStatisticsMapper, CategoryStatistics> implements CategoryStatisticsService {
}
