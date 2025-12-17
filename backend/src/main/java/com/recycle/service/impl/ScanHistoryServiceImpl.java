package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.ScanHistory;
import com.recycle.mapper.ScanHistoryMapper;
import com.recycle.service.ScanHistoryService;
import org.springframework.stereotype.Service;

@Service
public class ScanHistoryServiceImpl extends ServiceImpl<ScanHistoryMapper, ScanHistory> implements ScanHistoryService {
}
