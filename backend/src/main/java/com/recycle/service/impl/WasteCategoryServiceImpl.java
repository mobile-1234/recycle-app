package com.recycle.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.WasteCategory;
import com.recycle.mapper.WasteCategoryMapper;
import com.recycle.service.WasteCategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WasteCategoryServiceImpl extends ServiceImpl<WasteCategoryMapper, WasteCategory> implements WasteCategoryService {

    @Override
    public List<WasteCategory> getActiveCategories() {
        return this.list(new LambdaQueryWrapper<WasteCategory>()
                .eq(WasteCategory::getStatus, 1)
                .orderByAsc(WasteCategory::getSortOrder));
    }
}
