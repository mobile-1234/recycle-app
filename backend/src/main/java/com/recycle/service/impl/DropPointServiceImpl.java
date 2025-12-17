package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.DropPoint;
import com.recycle.mapper.DropPointMapper;
import com.recycle.service.DropPointService;
import org.springframework.stereotype.Service;

@Service
public class DropPointServiceImpl extends ServiceImpl<DropPointMapper, DropPoint> implements DropPointService {
}
