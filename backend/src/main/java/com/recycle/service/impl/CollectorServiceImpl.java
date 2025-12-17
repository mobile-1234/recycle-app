package com.recycle.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.Collector;
import com.recycle.mapper.CollectorMapper;
import com.recycle.service.CollectorService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CollectorServiceImpl extends ServiceImpl<CollectorMapper, Collector> implements CollectorService {

    @Override
    public List<Collector> getNearbyCollectors(Double longitude, Double latitude, Integer limit) {
        // 简单实现：获取在线的回收员，实际应该基于经纬度计算距离
        return this.list(new LambdaQueryWrapper<Collector>()
                .eq(Collector::getStatus, "online")
                .orderByDesc(Collector::getRating)
                .last("LIMIT " + (limit != null ? limit : 10)));
    }

    @Override
    public List<Collector> getOnlineCollectors() {
        return this.list(new LambdaQueryWrapper<Collector>()
                .eq(Collector::getStatus, "online")
                .orderByDesc(Collector::getRating));
    }
}
