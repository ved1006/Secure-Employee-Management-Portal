package com.employee.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AnnouncementRequestDTO {

    @NotBlank(message = "Announcement title is required")
    @Size(max = 150, message = "Announcement title cannot exceed 150 characters")
    private String title;

    @NotBlank(message = "Announcement content is required")
    private String content;

    public AnnouncementRequestDTO() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}