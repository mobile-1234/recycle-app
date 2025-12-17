package com.recycle.controller.client;

import com.recycle.common.Result;
import com.recycle.dto.LoginDTO;
import com.recycle.dto.RegisterDTO;
import com.recycle.entity.User;
import com.recycle.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Api(tags = "认证接口")
@RestController
@RequestMapping("/api/c/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @ApiOperation("用户注册")
    @PostMapping("/register")
    public Result<Void> register(@Valid @RequestBody RegisterDTO dto) {
        userService.register(dto.getPhone(), dto.getPassword());
        return Result.success();
    }

    @ApiOperation("用户登录")
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@Valid @RequestBody LoginDTO dto) {
        String token = userService.login(dto.getPhone(), dto.getPassword());
        User user = userService.getByPhone(dto.getPhone());

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user", user);

        return Result.success(data);
    }

    @ApiOperation("获取当前用户信息")
    @GetMapping("/info")
    public Result<User> getUserInfo(@RequestAttribute("userId") Long userId) {
        User user = userService.getById(userId);
        user.setPassword(null);
        return Result.success(user);
    }
}
