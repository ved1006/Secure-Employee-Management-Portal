package com.employee.management.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.employee.management.Model.Announcement;
import com.employee.management.Repository.AnnouncementRepository;
import com.employee.management.dto.AnnouncementRequestDTO;
import com.employee.management.dto.AnnouncementResponseDTO;
import com.employee.management.exception.ResourceNotFoundException;

@Service
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    public AnnouncementServiceImpl(
            AnnouncementRepository announcementRepository) {

        this.announcementRepository = announcementRepository;
    }

    @Override
    public AnnouncementResponseDTO createAnnouncement(
            AnnouncementRequestDTO dto) {

        Announcement announcement = new Announcement();

        announcement.setTitle(dto.getTitle());
        announcement.setContent(dto.getContent());
        announcement.setActive(true);

        Announcement saved =
                announcementRepository.save(announcement);

        return convertToDTO(saved);
    }

    @Override
    public List<AnnouncementResponseDTO> getActiveAnnouncements() {

        return announcementRepository
                .findByActiveTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Override
    public List<AnnouncementResponseDTO> getAllAnnouncements() {

        return announcementRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Override
    public AnnouncementResponseDTO updateAnnouncement(
            Long id,
            AnnouncementRequestDTO dto) {

        Announcement announcement =
                announcementRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Announcement not found with id: " + id
                                ));

        announcement.setTitle(dto.getTitle());
        announcement.setContent(dto.getContent());

        Announcement updated =
                announcementRepository.save(announcement);

        return convertToDTO(updated);
    }

    @Override
    public void deleteAnnouncement(Long id) {

        Announcement announcement =
                announcementRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Announcement not found with id: " + id
                                ));

        announcementRepository.delete(announcement);
    }

    private AnnouncementResponseDTO convertToDTO(
            Announcement announcement) {

        return new AnnouncementResponseDTO(
                announcement.getId(),
                announcement.getTitle(),
                announcement.getContent(),
                announcement.getCreatedAt(),
                announcement.getUpdatedAt(),
                announcement.isActive()
        );
    }
}