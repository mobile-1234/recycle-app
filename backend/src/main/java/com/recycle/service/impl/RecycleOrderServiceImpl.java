package com.recycle.service.impl;

import cn.hutool.core.util.IdUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.RecycleOrder;
import com.recycle.mapper.RecycleOrderMapper;
import com.recycle.service.RecycleOrderService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class RecycleOrderServiceImpl extends ServiceImpl<RecycleOrderMapper, RecycleOrder> implements RecycleOrderService {

    @Override
    public RecycleOrder createOrder(RecycleOrder order) {
        // 生成订单号
        String orderNo = "RO" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                + IdUtil.fastSimpleUUID().substring(0, 6).toUpperCase();
        order.setOrderNo(orderNo);
        order.setStatus("pending");
        order.setRated(0);

        this.save(order);
        return order;
    }

    @Override
    public Page<RecycleOrder> getUserOrders(Long userId, String status, int page, int size) {
        LambdaQueryWrapper<RecycleOrder> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(RecycleOrder::getUserId, userId);

        if (StringUtils.hasText(status) && !"all".equals(status)) {
            wrapper.eq(RecycleOrder::getStatus, status);
        }

        wrapper.orderByDesc(RecycleOrder::getCreatedAt);

        return this.page(new Page<>(page, size), wrapper);
    }

    @Override
    public void cancelOrder(Long orderId, Long userId, String reason) {
        RecycleOrder order = this.getById(orderId);
        if (order == null) {
            throw new RuntimeException("订单不存在");
        }

        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("无权操作此订单");
        }

        if (!"pending".equals(order.getStatus())) {
            throw new RuntimeException("订单状态不允许取消");
        }

        order.setStatus("cancelled");
        order.setCancelReason(reason);
        this.updateById(order);
    }

    @Override
    public void completeOrder(Long orderId, Long collectorId) {
        RecycleOrder order = this.getById(orderId);
        if (order == null) {
            throw new RuntimeException("订单不存在");
        }

        order.setStatus("completed");
        order.setCompletedAt(LocalDateTime.now());
        this.updateById(order);
    }
}
