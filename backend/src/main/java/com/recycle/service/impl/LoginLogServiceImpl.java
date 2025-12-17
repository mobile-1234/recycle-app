package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.LoginLog;
import com.recycle.mapper.LoginLogMapper;
import com.recycle.service.LoginLogService;
import org.springframework.stereotype.Service;

@Service
public class LoginLogServiceImpl extends ServiceImpl<LoginLogMapper, LoginLog> implements LoginLogService {
}
