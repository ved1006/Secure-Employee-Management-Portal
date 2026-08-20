package com.employee.management.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.employee.management.Service.AnnouncementService;
import com.employee.management.dto.AnnouncementRequestDTO;
import com.employee.management.dto.AnnouncementResponseDTO;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/announcements")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(
            AnnouncementService announcementService) {

        this.announcementService = announcementService;
    }

    @GetMapping
    public List<AnnouncementResponseDTO> getActiveAnnouncements() {

        return announcementService.getActiveAnnouncements();
    }

    @GetMapping("/all")
    public List<AnnouncementResponseDTO> getAllAnnouncements() {

        return announcementService.getAllAnnouncements();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public AnnouncementResponseDTO createAnnouncement(
            @Valid @RequestBody AnnouncementRequestDTO dto) {

        return announcementService.createAnnouncement(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public AnnouncementResponseDTO updateAnnouncement(
            @PathVariable Long id,
            @Valid @RequestBody AnnouncementRequestDTO dto) {

        return announcementService.updateAnnouncement(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public void deleteAnnouncement(
            @PathVariable Long id) {

        announcementService.deleteAnnouncement(id);
    }
}