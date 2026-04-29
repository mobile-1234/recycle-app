package com.recycle.controller.government;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.recycle.common.Result;
import com.recycle.entity.GovernmentUser;
import com.recycle.service.GovernmentUserService;
import com.recycle.util.JwtUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Api(tags = "G端认证接口")
@RestController
@RequestMapping("/api/g/auth")
@RequiredArgsConstructor
public class GovernmentAuthController {

    private final GovernmentUserService governmentUserService;
    private final JwtUtil jwtUtil;

    @ApiOperation("政府用户登录")
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> params) {
        String username = params.get("username");
        String password = params.get("password");

        if (username == null || password == null) {
            return Result.error("用户名和密码不能为空");
        }

        GovernmentUser user = governmentUserService.getOne(
                new LambdaQueryWrapper<GovernmentUser>().eq(GovernmentUser::getUsername, username)
        );

        if (user == null) {
            return Result.error("账号不存在");
        }

        if (user.getStatus() != null && user.getStatus() != 1) {
            return Result.error("账号已被禁用");
        }

        // 生成 JWT Token
        String token = jwtUtil.generateToken(user.getId(), username);

        // 更新最后登录时间
        user.setLastLoginAt(LocalDateTime.now());
        governmentUserService.updateById(user);

        // 隐藏敏感信息
        user.setPassword(null);

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user", user);

        return Result.success(data);
    }
}
