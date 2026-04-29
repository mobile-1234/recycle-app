package com.recycle.controller.business;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.recycle.common.Result;
import com.recycle.entity.EnterpriseEmployee;
import com.recycle.entity.Enterprise;
import com.recycle.service.EnterpriseEmployeeService;
import com.recycle.service.EnterpriseService;
import com.recycle.util.JwtUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Api(tags = "B端认证接口")
@RestController
@RequestMapping("/api/b/auth")
@RequiredArgsConstructor
public class BusinessAuthController {

    private final EnterpriseEmployeeService enterpriseEmployeeService;
    private final EnterpriseService enterpriseService;
    private final JwtUtil jwtUtil;

    @ApiOperation("企业用户登录")
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> params) {
        String phone = params.get("phone");
        String password = params.get("password");

        if (phone == null || password == null) {
            return Result.error("手机号和密码不能为空");
        }

        EnterpriseEmployee employee = enterpriseEmployeeService.getOne(
                new LambdaQueryWrapper<EnterpriseEmployee>().eq(EnterpriseEmployee::getPhone, phone)
        );

        if (employee == null) {
            return Result.error("账号不存在");
        }

        // 生成 JWT Token
        String token = jwtUtil.generateToken(employee.getId(), phone);

        // 查询关联企业信息
        Enterprise enterprise = enterpriseService.getById(employee.getEnterpriseId());

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("employee", employee);
        if (enterprise != null) {
            data.put("enterpriseName", enterprise.getName());
            data.put("enterpriseId", enterprise.getId());
        }

        return Result.success(data);
    }
}
