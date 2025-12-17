package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.DeviceMaintenance;
import com.recycle.mapper.DeviceMaintenanceMapper;
import com.recycle.service.DeviceMaintenanceService;
import org.springframework.stereotype.Service;

@Service
public class DeviceMaintenanceServiceImpl extends ServiceImpl<DeviceMaintenanceMapper, DeviceMaintenance> implements DeviceMaintenanceService {
}
