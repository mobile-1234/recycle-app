package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.CheckinRecord;
import com.recycle.mapper.CheckinRecordMapper;
import com.recycle.service.CheckinRecordService;
import org.springframework.stereotype.Service;

@Service
public class CheckinRecordServiceImpl extends ServiceImpl<CheckinRecordMapper, CheckinRecord> implements CheckinRecordService {
}
