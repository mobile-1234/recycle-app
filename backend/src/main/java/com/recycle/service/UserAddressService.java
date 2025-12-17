package com.recycle.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.recycle.entity.UserAddress;

import java.util.List;

public interface UserAddressService extends IService<UserAddress> {

    List<UserAddress> getUserAddresses(Long userId);

    UserAddress addAddress(UserAddress address);

    void updateAddress(Long userId, Long addressId, UserAddress address);

    void deleteAddress(Long userId, Long addressId);

    void setDefaultAddress(Long userId, Long addressId);

    UserAddress getDefaultAddress(Long userId);
}
