package com.privhealthai.chatbot;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatHistoryRepository extends JpaRepository<ChatHistoryEntity, UUID> {

    /** Most recent turns for a user, newest first — used to give the LLM conversation context. */
    List<ChatHistoryEntity> findTop8ByUserIdOrderByCreatedAtDesc(UUID userId);
}
