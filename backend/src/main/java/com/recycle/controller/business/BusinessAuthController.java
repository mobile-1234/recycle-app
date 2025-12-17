package com.recycle.controller.business;

import com.recycle.common.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Api(tags = "B端认证接口")
@RestController
@RequestMapping("/api/b/auth")
public class BusinessAuthController {

    @ApiOperation("企业用户登录")
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> params) {
        // TODO: 实现企业用户登录逻辑
        Map<String, Object> data = new HashMap<>();
        data.put("token", "business_token_placeholder");
        return Result.success(data);
    }
}
