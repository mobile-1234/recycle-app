package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.CustomerServiceMessage;
import com.recycle.mapper.CustomerServiceMessageMapper;
import com.recycle.service.CustomerServiceMessageService;
import org.springframework.stereotype.Service;

@Service
public class CustomerServiceMessageServiceImpl extends ServiceImpl<CustomerServiceMessageMapper, CustomerServiceMessage> implements CustomerServiceMessageService {
}
