package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.GovernmentWarning;
import com.recycle.mapper.GovernmentWarningMapper;
import com.recycle.service.GovernmentWarningService;
import org.springframework.stereotype.Service;

@Service
public class GovernmentWarningServiceImpl extends ServiceImpl<GovernmentWarningMapper, GovernmentWarning> implements GovernmentWarningService {
}
