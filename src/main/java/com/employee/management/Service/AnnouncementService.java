package com.employee.management.Service;

import java.util.List;

import com.employee.management.dto.AnnouncementRequestDTO;
import com.employee.management.dto.AnnouncementResponseDTO;

public interface AnnouncementService {

    AnnouncementResponseDTO createAnnouncement(
            AnnouncementRequestDTO dto
    );

    List<AnnouncementResponseDTO> getActiveAnnouncements();

    List<AnnouncementResponseDTO> getAllAnnouncements();

    AnnouncementResponseDTO updateAnnouncement(
            Long id,
            AnnouncementRequestDTO dto
    );

    void deleteAnnouncement(Long id);
}