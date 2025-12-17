package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.BusinessOrder;
import com.recycle.mapper.BusinessOrderMapper;
import com.recycle.service.BusinessOrderService;
import org.springframework.stereotype.Service;

@Service
public class BusinessOrderServiceImpl extends ServiceImpl<BusinessOrderMapper, BusinessOrder> implements BusinessOrderService {
}
