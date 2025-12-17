package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.DonationRecord;
import com.recycle.mapper.DonationRecordMapper;
import com.recycle.service.DonationRecordService;
import org.springframework.stereotype.Service;

@Service
public class DonationRecordServiceImpl extends ServiceImpl<DonationRecordMapper, DonationRecord> implements DonationRecordService {
}
