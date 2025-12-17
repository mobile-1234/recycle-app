package com.recycle.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.recycle.entity.User;

public interface UserService extends IService<User> {

    User getByPhone(String phone);

    boolean register(String phone, String password);

    String login(String phone, String password);

    void updateUserInfo(Long userId, User user);
}
