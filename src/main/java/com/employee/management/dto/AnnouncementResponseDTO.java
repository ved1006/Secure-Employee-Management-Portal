package com.employee.management.dto;

import java.time.LocalDateTime;

public class AnnouncementResponseDTO {

    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean active;

    public AnnouncementResponseDTO() {
    }

    public AnnouncementResponseDTO(
            Long id,
            String title,
            String content,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            boolean active) {

        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public boolean isActive() {
        return active;
    }
}