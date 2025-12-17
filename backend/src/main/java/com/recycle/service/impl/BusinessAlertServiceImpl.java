package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.BusinessAlert;
import com.recycle.mapper.BusinessAlertMapper;
import com.recycle.service.BusinessAlertService;
import org.springframework.stereotype.Service;

@Service
public class BusinessAlertServiceImpl extends ServiceImpl<BusinessAlertMapper, BusinessAlert> implements BusinessAlertService {
}
