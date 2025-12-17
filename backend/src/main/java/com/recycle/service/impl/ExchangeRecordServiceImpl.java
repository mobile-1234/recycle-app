package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.ExchangeRecord;
import com.recycle.mapper.ExchangeRecordMapper;
import com.recycle.service.ExchangeRecordService;
import org.springframework.stereotype.Service;

@Service
public class ExchangeRecordServiceImpl extends ServiceImpl<ExchangeRecordMapper, ExchangeRecord> implements ExchangeRecordService {
}
