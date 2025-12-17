package com.recycle.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.recycle.entity.AiChatHistory;
import com.recycle.mapper.AiChatHistoryMapper;
import com.recycle.service.AiChatHistoryService;
import org.springframework.stereotype.Service;

@Service
public class AiChatHistoryServiceImpl extends ServiceImpl<AiChatHistoryMapper, AiChatHistory> implements AiChatHistoryService {
}
