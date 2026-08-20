package com.employee.management.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.employee.management.Service.LeaveRequestService;
import com.employee.management.dto.LeaveRequestDTO;
import com.employee.management.dto.LeaveResponseDTO;

@RestController
@RequestMapping("/leaves")
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    public LeaveRequestController(
            LeaveRequestService leaveRequestService) {
        this.leaveRequestService = leaveRequestService;
    }

    // Employee submits a leave request
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('EMPLOYEE')")
    public LeaveResponseDTO createLeaveRequest(
            @RequestBody LeaveRequestDTO dto,
            Authentication authentication) {

        String email = authentication.getName();

        return leaveRequestService.createLeaveRequest(
                email,
                dto
        );
    }

    // Employee views their own leave requests
    @GetMapping("/my")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public List<LeaveResponseDTO> getMyLeaveRequests(
            Authentication authentication) {

        String email = authentication.getName();

        return leaveRequestService.getMyLeaveRequests(email);
    }

    // Admin/HR views all leave requests
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public List<LeaveResponseDTO> getAllLeaveRequests() {

        return leaveRequestService.getAllLeaveRequests();
    }

    // Admin/HR approves a leave request
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public LeaveResponseDTO approveLeaveRequest(
            @PathVariable Long id) {

        return leaveRequestService.approveLeaveRequest(id);
    }

    // Admin/HR rejects a leave request
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public LeaveResponseDTO rejectLeaveRequest(
            @PathVariable Long id) {

        return leaveRequestService.rejectLeaveRequest(id);
    }
}