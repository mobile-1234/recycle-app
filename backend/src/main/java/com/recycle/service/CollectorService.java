package com.recycle.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.recycle.entity.Collector;

import java.util.List;

public interface CollectorService extends IService<Collector> {

    List<Collector> getNearbyCollectors(Double longitude, Double latitude, Integer limit);

    List<Collector> getOnlineCollectors();
}
