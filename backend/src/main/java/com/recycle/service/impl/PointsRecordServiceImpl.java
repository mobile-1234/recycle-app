package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.PointsRecord;
import com.recycle.mapper.PointsRecordMapper;
import com.recycle.service.PointsRecordService;
import org.springframework.stereotype.Service;

@Service
public class PointsRecordServiceImpl extends ServiceImpl<PointsRecordMapper, PointsRecord> implements PointsRecordService {
}
