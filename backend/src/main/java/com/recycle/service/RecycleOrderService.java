package com.recycle.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.recycle.entity.RecycleOrder;

public interface RecycleOrderService extends IService<RecycleOrder> {

    RecycleOrder createOrder(RecycleOrder order);

    Page<RecycleOrder> getUserOrders(Long userId, String status, int page, int size);

    void cancelOrder(Long orderId, Long userId, String reason);

    void completeOrder(Long orderId, Long collectorId);
}
