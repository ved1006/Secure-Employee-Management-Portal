package com.employee.management.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.employee.management.Model.Announcement;

public interface AnnouncementRepository
        extends JpaRepository<Announcement, Long> {

    List<Announcement> findByActiveTrueOrderByCreatedAtDesc();
}