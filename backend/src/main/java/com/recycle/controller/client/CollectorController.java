package com.recycle.controller.client;

import com.recycle.common.Result;
import com.recycle.entity.Collector;
import com.recycle.service.CollectorService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Api(tags = "回收员接口")
@RestController
@RequestMapping("/api/c/collectors")
@RequiredArgsConstructor
public class CollectorController {

    private final CollectorService collectorService;

    @ApiOperation("获取附近回收员")
    @GetMapping("/nearby")
    public Result<List<Collector>> getNearbyCollectors(
            @RequestParam(required = false) Double longitude,
            @RequestParam(required = false) Double latitude,
            @RequestParam(defaultValue = "10") Integer limit) {
        List<Collector> collectors = collectorService.getNearbyCollectors(longitude, latitude, limit);
        return Result.success(collectors);
    }

    @ApiOperation("获取在线回收员列表")
    @GetMapping("/online")
    public Result<List<Collector>> getOnlineCollectors() {
        List<Collector> collectors = collectorService.getOnlineCollectors();
        return Result.success(collectors);
    }

    @ApiOperation("获取回收员详情")
    @GetMapping("/{id}")
    public Result<Collector> getCollectorDetail(@PathVariable Long id) {
        Collector collector = collectorService.getById(id);
        return Result.success(collector);
    }
}
