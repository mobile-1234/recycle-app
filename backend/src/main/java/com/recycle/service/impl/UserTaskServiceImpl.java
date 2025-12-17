package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.UserTask;
import com.recycle.mapper.UserTaskMapper;
import com.recycle.service.UserTaskService;
import org.springframework.stereotype.Service;

@Service
public class UserTaskServiceImpl extends ServiceImpl<UserTaskMapper, UserTask> implements UserTaskService {
}
