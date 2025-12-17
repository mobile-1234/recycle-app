package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.GovernmentOperationLog;
import com.recycle.mapper.GovernmentOperationLogMapper;
import com.recycle.service.GovernmentOperationLogService;
import org.springframework.stereotype.Service;

@Service
public class GovernmentOperationLogServiceImpl extends ServiceImpl<GovernmentOperationLogMapper, GovernmentOperationLog> implements GovernmentOperationLogService {
}
