package com.recycle.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.recycle.entity.Product;

public interface ProductService extends IService<Product> {

    Page<Product> getProductList(String category, int page, int size);
}
