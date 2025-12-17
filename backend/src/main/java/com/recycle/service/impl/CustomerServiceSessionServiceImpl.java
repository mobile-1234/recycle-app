package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.CustomerServiceSession;
import com.recycle.mapper.CustomerServiceSessionMapper;
import com.recycle.service.CustomerServiceSessionService;
import org.springframework.stereotype.Service;

@Service
public class CustomerServiceSessionServiceImpl extends ServiceImpl<CustomerServiceSessionMapper, CustomerServiceSession> implements CustomerServiceSessionService {
}
