package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.NotificationSetting;
import com.recycle.mapper.NotificationSettingMapper;
import com.recycle.service.NotificationSettingService;
import org.springframework.stereotype.Service;

@Service
public class NotificationSettingServiceImpl extends ServiceImpl<NotificationSettingMapper, NotificationSetting> implements NotificationSettingService {
}
