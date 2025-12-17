package com.recycle.controller.client;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.recycle.common.PageResult;
import com.recycle.common.Result;
import com.recycle.entity.Product;
import com.recycle.service.ProductService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Api(tags = "商品接口")
@RestController
@RequestMapping("/api/c/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @ApiOperation("获取商品列表")
    @GetMapping
    public Result<PageResult<Product>> getProducts(
            @RequestParam(defaultValue = "all") String category,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Page<Product> pageResult = productService.getProductList(category, page, size);
        PageResult<Product> result = new PageResult<>(
                pageResult.getRecords(),
                pageResult.getTotal(),
                pageResult.getSize(),
                pageResult.getCurrent()
        );
        return Result.success(result);
    }

    @ApiOperation("获取商品详情")
    @GetMapping("/{id}")
    public Result<Product> getProductDetail(@PathVariable Long id) {
        Product product = productService.getById(id);
        return Result.success(product);
    }
}
