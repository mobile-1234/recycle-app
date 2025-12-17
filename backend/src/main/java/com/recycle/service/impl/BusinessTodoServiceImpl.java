package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.BusinessTodo;
import com.recycle.mapper.BusinessTodoMapper;
import com.recycle.service.BusinessTodoService;
import org.springframework.stereotype.Service;

@Service
public class BusinessTodoServiceImpl extends ServiceImpl<BusinessTodoMapper, BusinessTodo> implements BusinessTodoService {
}
