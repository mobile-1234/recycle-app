package com.recycle.controller.client;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.recycle.common.PageResult;
import com.recycle.common.Result;
import com.recycle.entity.RecycleOrder;
import com.recycle.service.RecycleOrderService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Api(tags = "订单接口")
@RestController
@RequestMapping("/api/c/orders")
@RequiredArgsConstructor
public class OrderController {

    private final RecycleOrderService recycleOrderService;

    @ApiOperation("创建回收订单")
    @PostMapping
    public Result<RecycleOrder> createOrder(@RequestAttribute("userId") Long userId, @RequestBody RecycleOrder order) {
        order.setUserId(userId);
        RecycleOrder created = recycleOrderService.createOrder(order);
        return Result.success(created);
    }

    @ApiOperation("获取订单列表")
    @GetMapping
    public Result<PageResult<RecycleOrder>> getOrders(
            @RequestAttribute("userId") Long userId,
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Page<RecycleOrder> pageResult = recycleOrderService.getUserOrders(userId, status, page, size);
        PageResult<RecycleOrder> result = new PageResult<>(
                pageResult.getRecords(),
                pageResult.getTotal(),
                pageResult.getSize(),
                pageResult.getCurrent()
        );
        return Result.success(result);
    }

    @ApiOperation("获取订单详情")
    @GetMapping("/{id}")
    public Result<RecycleOrder> getOrderDetail(@RequestAttribute("userId") Long userId, @PathVariable Long id) {
        RecycleOrder order = recycleOrderService.getById(id);
        if (order == null || !order.getUserId().equals(userId)) {
            return Result.error("订单不存在");
        }
        return Result.success(order);
    }

    @ApiOperation("取消订单")
    @PostMapping("/{id}/cancel")
    public Result<Void> cancelOrder(
            @RequestAttribute("userId") Long userId,
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {
        recycleOrderService.cancelOrder(id, userId, reason);
        return Result.success();
    }
}
