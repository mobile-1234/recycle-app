package com.recycle.controller.government;

import com.recycle.common.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Api(tags = "G端认证接口")
@RestController
@RequestMapping("/api/g/auth")
public class GovernmentAuthController {

    @ApiOperation("政府用户登录")
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> params) {
        // TODO: 实现政府用户登录逻辑
        Map<String, Object> data = new HashMap<>();
        data.put("token", "government_token_placeholder");
        return Result.success(data);
    }
}
