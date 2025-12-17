package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.DonationProject;
import com.recycle.mapper.DonationProjectMapper;
import com.recycle.service.DonationProjectService;
import org.springframework.stereotype.Service;

@Service
public class DonationProjectServiceImpl extends ServiceImpl<DonationProjectMapper, DonationProject> implements DonationProjectService {
}
