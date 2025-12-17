package com.recycle.controller.client;

import com.recycle.common.Result;
import com.recycle.entity.WasteCategory;
import com.recycle.service.WasteCategoryService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Api(tags = "分类接口")
@RestController
@RequestMapping("/api/c/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final WasteCategoryService wasteCategoryService;

    @ApiOperation("获取所有分类")
    @GetMapping
    public Result<List<WasteCategory>> getCategories() {
        List<WasteCategory> categories = wasteCategoryService.getActiveCategories();
        return Result.success(categories);
    }

    @ApiOperation("获取分类详情")
    @GetMapping("/{id}")
    public Result<WasteCategory> getCategoryDetail(@PathVariable Long id) {
        WasteCategory category = wasteCategoryService.getById(id);
        return Result.success(category);
    }
}
