package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.StatisticsReport;
import com.recycle.mapper.StatisticsReportMapper;
import com.recycle.service.StatisticsReportService;
import org.springframework.stereotype.Service;

@Service
public class StatisticsReportServiceImpl extends ServiceImpl<StatisticsReportMapper, StatisticsReport> implements StatisticsReportService {
}
