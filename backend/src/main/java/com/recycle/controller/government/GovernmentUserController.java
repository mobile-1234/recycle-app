package com.recycle.controller.government;

import com.recycle.common.Result;
import com.recycle.entity.User;
import com.recycle.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Api(tags = "G端用户接口")
@RestController
@RequestMapping("/api/g/user")
@RequiredArgsConstructor
public class GovernmentUserController {

    private final UserService userService;

    @ApiOperation("获取用户信息")
    @GetMapping("/info")
    public Result<User> getUserInfo(@RequestAttribute(value = "userId", required = false) Long userId) {
        Long effectiveUserId = userId != null ? userId : 1L;
        User user = userService.getById(effectiveUserId);
        if (user != null) {
            user.setPassword(null);
        }
        return Result.success(user);
    }

    @ApiOperation("更新用户头像和昵称")
    @PutMapping("/profile")
    public Result<Void> updateProfile(@RequestAttribute(value = "userId", required = false) Long userId, @RequestBody User user) {
        Long effectiveUserId = userId != null ? userId : 1L;
        
        User updateUser = new User();
        updateUser.setId(effectiveUserId);
        updateUser.setNickname(user.getNickname());
        updateUser.setAvatar(user.getAvatar());
        updateUser.setAvatarIndex(user.getAvatarIndex());
        
        userService.updateById(updateUser);
        return Result.success();
    }
}
