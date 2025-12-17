package com.recycle.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.Product;
import com.recycle.mapper.ProductMapper;
import com.recycle.service.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class ProductServiceImpl extends ServiceImpl<ProductMapper, Product> implements ProductService {

    @Override
    public Page<Product> getProductList(String category, int page, int size) {
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Product::getStatus, 1);

        if (StringUtils.hasText(category) && !"all".equals(category)) {
            wrapper.eq(Product::getCategory, category);
        }

        wrapper.orderByAsc(Product::getSortOrder);

        return this.page(new Page<>(page, size), wrapper);
    }
}
