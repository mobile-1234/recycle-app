package com.recycle.controller.client;

import com.recycle.common.Result;
import com.recycle.entity.User;
import com.recycle.entity.UserAddress;
import com.recycle.service.UserService;
import com.recycle.service.UserAddressService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Api(tags = "用户接口")
@RestController
@RequestMapping("/api/c/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserAddressService userAddressService;

    @ApiOperation("获取用户信息")
    @GetMapping("/info")
    public Result<User> getUserInfo(@RequestAttribute("userId") Long userId) {
        User user = userService.getById(userId);
        user.setPassword(null);
        return Result.success(user);
    }

    @ApiOperation("更新用户信息")
    @PutMapping("/info")
    public Result<Void> updateUserInfo(@RequestAttribute("userId") Long userId, @RequestBody User user) {
        userService.updateUserInfo(userId, user);
        return Result.success();
    }

    @ApiOperation("更新用户头像和昵称")
    @PutMapping("/profile")
    public Result<Void> updateProfile(@RequestAttribute(value = "userId", required = false) Long userId, @RequestBody User user) {
        // 开发环境允许不传userId，使用默认值1
        Long effectiveUserId = userId != null ? userId : 1L;
        
        User updateUser = new User();
        updateUser.setId(effectiveUserId);
        updateUser.setNickname(user.getNickname());
        updateUser.setAvatar(user.getAvatar());
        updateUser.setAvatarIndex(user.getAvatarIndex());
        
        userService.updateById(updateUser);
        return Result.success();
    }

    @ApiOperation("获取用户地址列表")
    @GetMapping("/addresses")
    public Result<List<UserAddress>> getAddresses(@RequestAttribute("userId") Long userId) {
        List<UserAddress> addresses = userAddressService.getUserAddresses(userId);
        return Result.success(addresses);
    }

    @ApiOperation("添加地址")
    @PostMapping("/addresses")
    public Result<UserAddress> addAddress(@RequestAttribute("userId") Long userId, @RequestBody UserAddress address) {
        address.setUserId(userId);
        UserAddress saved = userAddressService.addAddress(address);
        return Result.success(saved);
    }

    @ApiOperation("更新地址")
    @PutMapping("/addresses/{id}")
    public Result<Void> updateAddress(@RequestAttribute("userId") Long userId,
                                       @PathVariable Long id,
                                       @RequestBody UserAddress address) {
        userAddressService.updateAddress(userId, id, address);
        return Result.success();
    }

    @ApiOperation("删除地址")
    @DeleteMapping("/addresses/{id}")
    public Result<Void> deleteAddress(@RequestAttribute("userId") Long userId, @PathVariable Long id) {
        userAddressService.deleteAddress(userId, id);
        return Result.success();
    }

    @ApiOperation("设置默认地址")
    @PutMapping("/addresses/{id}/default")
    public Result<Void> setDefaultAddress(@RequestAttribute("userId") Long userId, @PathVariable Long id) {
        userAddressService.setDefaultAddress(userId, id);
        return Result.success();
    }
}
