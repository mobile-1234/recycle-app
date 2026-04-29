package com.recycle.controller.government;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.recycle.common.Result;
import com.recycle.entity.RecycleOrder;
import com.recycle.entity.RegionStatistics;
import com.recycle.service.RecycleOrderService;
import com.recycle.service.RegionStatisticsService;
import com.recycle.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Api(tags = "G端统计接口")
@RestController
@RequestMapping("/api/g/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final RecycleOrderService recycleOrderService;
    private final UserService userService;
    private final RegionStatisticsService regionStatisticsService;

    @ApiOperation("获取总体统计数据")
    @GetMapping("/overview")
    public Result<Map<String, Object>> getOverview() {
        Map<String, Object> data = new HashMap<>();

        // 订单总数
        long totalOrders = recycleOrderService.count();
        data.put("totalOrders", totalOrders);

        // 用户总数
        long totalUsers = userService.count();
        data.put("totalUsers", totalUsers);

        // 从已完成订单中汇总回收重量和碳减排
        List<RecycleOrder> completedOrders = recycleOrderService.list(
                new LambdaQueryWrapper<RecycleOrder>().eq(RecycleOrder::getStatus, "completed")
        );

        BigDecimal totalWeight = completedOrders.stream()
                .map(o -> o.getWeight() != null ? o.getWeight() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalCarbon = completedOrders.stream()
                .map(o -> o.getCarbonReduction() != null ? o.getCarbonReduction() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        data.put("totalRecycleWeight", totalWeight);
        data.put("totalCarbonReduction", totalCarbon);
        data.put("completedOrders", completedOrders.size());

        return Result.success(data);
    }

    @ApiOperation("获取区域统计")
    @GetMapping("/regions")
    public Result<List<Map<String, Object>>> getRegionStatistics() {
        List<RegionStatistics> regionList = regionStatisticsService.list(
                new LambdaQueryWrapper<RegionStatistics>().orderByDesc(RegionStatistics::getStatDate)
        );

        List<Map<String, Object>> result = regionList.stream().map(r -> {
            Map<String, Object> item = new HashMap<>();
            item.put("id", r.getId());
            item.put("regionId", r.getRegionId());
            item.put("regionName", r.getRegionName());
            item.put("statDate", r.getStatDate());
            item.put("recycleVolume", r.getRecycleVolume());
            item.put("recycleRate", r.getRecycleRate());
            item.put("accuracyRate", r.getAccuracyRate());
            item.put("carbonReduction", r.getCarbonReduction());
            item.put("companies", r.getCompanies());
            item.put("trend", r.getTrend());
            return item;
        }).collect(Collectors.toList());

        return Result.success(result);
    }
}
