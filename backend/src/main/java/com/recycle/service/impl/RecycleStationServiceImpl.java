package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.RecycleStation;
import com.recycle.mapper.RecycleStationMapper;
import com.recycle.service.RecycleStationService;
import org.springframework.stereotype.Service;

@Service
public class RecycleStationServiceImpl extends ServiceImpl<RecycleStationMapper, RecycleStation> implements RecycleStationService {
}
