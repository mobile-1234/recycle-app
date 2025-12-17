package com.recycle.service.impl;

import cn.hutool.core.util.RandomUtil;
import cn.hutool.crypto.SecureUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.User;
import com.recycle.mapper.UserMapper;
import com.recycle.service.UserService;
import com.recycle.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    private final JwtUtil jwtUtil;

    @Override
    public User getByPhone(String phone) {
        return this.getOne(new LambdaQueryWrapper<User>().eq(User::getPhone, phone));
    }

    @Override
    public boolean register(String phone, String password) {
        // 检查手机号是否已注册
        if (getByPhone(phone) != null) {
            throw new RuntimeException("该手机号已注册");
        }

        User user = new User();
        user.setPhone(phone);
        user.setPassword(SecureUtil.md5(password));
        user.setNickname("环保达人");
        user.setAvatarIndex(1);
        user.setLevel(1);
        user.setLevelName("LV1 环保新手");
        user.setLevelProgress(0);
        user.setTotalPoints(0);
        user.setAvailablePoints(0);
        user.setInviteCode(RandomUtil.randomString(8).toUpperCase());
        user.setStatus(1);

        return this.save(user);
    }

    @Override
    public String login(String phone, String password) {
        User user = getByPhone(phone);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        if (!SecureUtil.md5(password).equals(user.getPassword())) {
            throw new RuntimeException("密码错误");
        }

        if (user.getStatus() != 1) {
            throw new RuntimeException("账号已被禁用");
        }

        // 更新最后登录时间
        user.setLastLoginAt(LocalDateTime.now());
        this.updateById(user);

        // 生成token
        return jwtUtil.generateToken(user.getId(), user.getPhone());
    }

    @Override
    public void updateUserInfo(Long userId, User user) {
        User existUser = this.getById(userId);
        if (existUser == null) {
            throw new RuntimeException("用户不存在");
        }

        existUser.setNickname(user.getNickname());
        existUser.setAvatar(user.getAvatar());
        existUser.setAvatarIndex(user.getAvatarIndex());

        this.updateById(existUser);
    }
}
