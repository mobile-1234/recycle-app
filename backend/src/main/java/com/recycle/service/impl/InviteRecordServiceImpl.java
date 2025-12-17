package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.InviteRecord;
import com.recycle.mapper.InviteRecordMapper;
import com.recycle.service.InviteRecordService;
import org.springframework.stereotype.Service;

@Service
public class InviteRecordServiceImpl extends ServiceImpl<InviteRecordMapper, InviteRecord> implements InviteRecordService {
}
