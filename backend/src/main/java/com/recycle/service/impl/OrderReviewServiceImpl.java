package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.OrderReview;
import com.recycle.mapper.OrderReviewMapper;
import com.recycle.service.OrderReviewService;
import org.springframework.stereotype.Service;

@Service
public class OrderReviewServiceImpl extends ServiceImpl<OrderReviewMapper, OrderReview> implements OrderReviewService {
}
