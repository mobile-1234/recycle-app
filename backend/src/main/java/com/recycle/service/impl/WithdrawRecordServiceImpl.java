package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.WithdrawRecord;
import com.recycle.mapper.WithdrawRecordMapper;
import com.recycle.service.WithdrawRecordService;
import org.springframework.stereotype.Service;

@Service
public class WithdrawRecordServiceImpl extends ServiceImpl<WithdrawRecordMapper, WithdrawRecord> implements WithdrawRecordService {
}
