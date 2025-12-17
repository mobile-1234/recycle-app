package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.DeviceAlert;
import com.recycle.mapper.DeviceAlertMapper;
import com.recycle.service.DeviceAlertService;
import org.springframework.stereotype.Service;

@Service
public class DeviceAlertServiceImpl extends ServiceImpl<DeviceAlertMapper, DeviceAlert> implements DeviceAlertService {
}
