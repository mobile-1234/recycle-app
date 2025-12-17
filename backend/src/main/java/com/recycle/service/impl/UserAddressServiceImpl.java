package com.recycle.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.UserAddress;
import com.recycle.mapper.UserAddressMapper;
import com.recycle.service.UserAddressService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserAddressServiceImpl extends ServiceImpl<UserAddressMapper, UserAddress> implements UserAddressService {

    @Override
    public List<UserAddress> getUserAddresses(Long userId) {
        return this.list(new LambdaQueryWrapper<UserAddress>()
                .eq(UserAddress::getUserId, userId)
                .orderByDesc(UserAddress::getIsDefault)
                .orderByDesc(UserAddress::getCreatedAt));
    }

    @Override
    @Transactional
    public UserAddress addAddress(UserAddress address) {
        // 如果是第一个地址，设为默认
        long count = this.count(new LambdaQueryWrapper<UserAddress>()
                .eq(UserAddress::getUserId, address.getUserId()));
        if (count == 0) {
            address.setIsDefault(1);
        }

        // 生成完整地址
        address.setFullAddress(address.getProvince() + address.getCity() + address.getDistrict() + address.getDetail());

        this.save(address);
        return address;
    }

    @Override
    public void updateAddress(Long userId, Long addressId, UserAddress address) {
        UserAddress existing = this.getById(addressId);
        if (existing == null || !existing.getUserId().equals(userId)) {
            throw new RuntimeException("地址不存在");
        }

        address.setId(addressId);
        address.setUserId(userId);
        address.setFullAddress(address.getProvince() + address.getCity() + address.getDistrict() + address.getDetail());
        this.updateById(address);
    }

    @Override
    public void deleteAddress(Long userId, Long addressId) {
        UserAddress existing = this.getById(addressId);
        if (existing == null || !existing.getUserId().equals(userId)) {
            throw new RuntimeException("地址不存在");
        }

        this.removeById(addressId);
    }

    @Override
    @Transactional
    public void setDefaultAddress(Long userId, Long addressId) {
        // 先取消其他默认地址
        this.update(new LambdaUpdateWrapper<UserAddress>()
                .eq(UserAddress::getUserId, userId)
                .set(UserAddress::getIsDefault, 0));

        // 设置新的默认地址
        this.update(new LambdaUpdateWrapper<UserAddress>()
                .eq(UserAddress::getId, addressId)
                .eq(UserAddress::getUserId, userId)
                .set(UserAddress::getIsDefault, 1));
    }

    @Override
    public UserAddress getDefaultAddress(Long userId) {
        return this.getOne(new LambdaQueryWrapper<UserAddress>()
                .eq(UserAddress::getUserId, userId)
                .eq(UserAddress::getIsDefault, 1));
    }
}
