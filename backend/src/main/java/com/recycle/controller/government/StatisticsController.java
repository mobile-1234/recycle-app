package com.recycle.controller.government;

import com.recycle.common.Result;
import com.recycle.service.RecycleOrderService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Api(tags = "G端统计接口")
@RestController
@RequestMapping("/api/g/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final RecycleOrderService recycleOrderService;

    @ApiOperation("获取总体统计数据")
    @GetMapping("/overview")
    public Result<Map<String, Object>> getOverview() {
        Map<String, Object> data = new HashMap<>();
        
        // 订单总数
        long totalOrders = recycleOrderService.count();
        data.put("totalOrders", totalOrders);
        
        // TODO: 添加更多统计数据
        data.put("totalRecycleWeight", 0);
        data.put("totalCarbonReduction", 0);
        data.put("totalUsers", 0);
        
        return Result.success(data);
    }

    @ApiOperation("获取区域统计")
    @GetMapping("/regions")
    public Result<Map<String, Object>> getRegionStatistics() {
        Map<String, Object> data = new HashMap<>();
        // TODO: 实现区域统计
        return Result.success(data);
    }
}
