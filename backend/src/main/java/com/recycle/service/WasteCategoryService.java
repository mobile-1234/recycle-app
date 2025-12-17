package com.recycle.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.recycle.entity.WasteCategory;

import java.util.List;

public interface WasteCategoryService extends IService<WasteCategory> {

    List<WasteCategory> getActiveCategories();
}
