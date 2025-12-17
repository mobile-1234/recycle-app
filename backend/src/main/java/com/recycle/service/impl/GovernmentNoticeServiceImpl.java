package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.GovernmentNotice;
import com.recycle.mapper.GovernmentNoticeMapper;
import com.recycle.service.GovernmentNoticeService;
import org.springframework.stereotype.Service;

@Service
public class GovernmentNoticeServiceImpl extends ServiceImpl<GovernmentNoticeMapper, GovernmentNotice> implements GovernmentNoticeService {
}
