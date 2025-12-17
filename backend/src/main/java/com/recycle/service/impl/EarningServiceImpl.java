package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.Earning;
import com.recycle.mapper.EarningMapper;
import com.recycle.service.EarningService;
import org.springframework.stereotype.Service;

@Service
public class EarningServiceImpl extends ServiceImpl<EarningMapper, Earning> implements EarningService {
}
