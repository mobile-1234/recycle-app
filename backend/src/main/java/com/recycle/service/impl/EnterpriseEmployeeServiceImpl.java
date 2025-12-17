package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.EnterpriseEmployee;
import com.recycle.mapper.EnterpriseEmployeeMapper;
import com.recycle.service.EnterpriseEmployeeService;
import org.springframework.stereotype.Service;

@Service
public class EnterpriseEmployeeServiceImpl extends ServiceImpl<EnterpriseEmployeeMapper, EnterpriseEmployee> implements EnterpriseEmployeeService {
}
