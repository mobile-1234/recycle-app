package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.GovernmentUser;
import com.recycle.mapper.GovernmentUserMapper;
import com.recycle.service.GovernmentUserService;
import org.springframework.stereotype.Service;

@Service
public class GovernmentUserServiceImpl extends ServiceImpl<GovernmentUserMapper, GovernmentUser> implements GovernmentUserService {
}
