package com.recycle.controller.business;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.recycle.common.PageResult;
import com.recycle.common.Result;
import com.recycle.entity.RecycleOrder;
import com.recycle.service.RecycleOrderService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Api(tags = "B端订单接口")
@RestController
@RequestMapping("/api/b/orders")
@RequiredArgsConstructor
public class BusinessOrderController {

    private final RecycleOrderService recycleOrderService;

    @ApiOperation("获取订单列表")
    @GetMapping
    public Result<PageResult<RecycleOrder>> getOrders(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String status) {
        
        LambdaQueryWrapper<RecycleOrder> wrapper = new LambdaQueryWrapper<>();
        if (status != null && !"all".equals(status)) {
            wrapper.eq(RecycleOrder::getStatus, status);
        }
        wrapper.orderByDesc(RecycleOrder::getCreatedAt);
        
        Page<RecycleOrder> pageResult = recycleOrderService.page(new Page<>(page, size), wrapper);
        PageResult<RecycleOrder> result = new PageResult<>(
                pageResult.getRecords(),
                pageResult.getTotal(),
                pageResult.getSize(),
                pageResult.getCurrent()
        );
        return Result.success(result);
    }

    @ApiOperation("接单")
    @PostMapping("/{id}/accept")
    public Result<Void> acceptOrder(@PathVariable Long id, @RequestParam Long collectorId) {
        RecycleOrder order = recycleOrderService.getById(id);
        if (order == null) {
            return Result.error("订单不存在");
        }
        order.setStatus("accepted");
        order.setCollectorId(collectorId);
        recycleOrderService.updateById(order);
        return Result.success();
    }

    @ApiOperation("完成订单")
    @PostMapping("/{id}/complete")
    public Result<Void> completeOrder(@PathVariable Long id, @RequestParam Long collectorId) {
        recycleOrderService.completeOrder(id, collectorId);
        return Result.success();
    }
}
