package com.employee.management.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.employee.management.Model.Employee;
import com.employee.management.Model.LeaveRequest;
import com.employee.management.Model.LeaveStatus;
import com.employee.management.Repository.EmployeeRepository;
import com.employee.management.Repository.LeaveRequestRepository;
import com.employee.management.dto.LeaveRequestDTO;
import com.employee.management.dto.LeaveResponseDTO;

@Service
public class LeaveRequestServiceImpl implements LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;

    public LeaveRequestServiceImpl(
            LeaveRequestRepository leaveRequestRepository,
            EmployeeRepository employeeRepository) {

        this.leaveRequestRepository = leaveRequestRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    @Transactional
    public LeaveResponseDTO createLeaveRequest(
            String email,
            LeaveRequestDTO dto) {

        // Find the employee using the logged-in user's email
        Employee employee = employeeRepository
                .findByUser_Email(email)
                .orElseThrow(() ->
                        new RuntimeException("Employee profile not found"));

        // Validate dates
        if (dto.getStartDate().isAfter(dto.getEndDate())) {
            throw new RuntimeException(
                    "Start date cannot be after end date");
        }

        // Create LeaveRequest
        LeaveRequest leaveRequest = new LeaveRequest();

        leaveRequest.setEmployee(employee);
        leaveRequest.setLeaveType(dto.getLeaveType());
        leaveRequest.setStartDate(dto.getStartDate());
        leaveRequest.setEndDate(dto.getEndDate());
        leaveRequest.setReason(dto.getReason());

        // Every new request starts as PENDING
        leaveRequest.setStatus(LeaveStatus.PENDING);

        LeaveRequest savedLeave =
                leaveRequestRepository.save(leaveRequest);

        return convertToDTO(savedLeave);
    }

    @Override
    public List<LeaveResponseDTO> getMyLeaveRequests(
            String email) {

        // Find logged-in employee
        Employee employee = employeeRepository
                .findByUser_Email(email)
                .orElseThrow(() ->
                        new RuntimeException("Employee profile not found"));

        // Get only this employee's leave requests
        List<LeaveRequest> leaves =
                leaveRequestRepository
                        .findByEmployee_Id(employee.getId());

        List<LeaveResponseDTO> responseList =
                new ArrayList<>();

        for (LeaveRequest leave : leaves) {
            responseList.add(convertToDTO(leave));
        }

        return responseList;
    }

    @Override
    public List<LeaveResponseDTO> getAllLeaveRequests() {

        List<LeaveRequest> leaves =
                leaveRequestRepository.findAll();

        List<LeaveResponseDTO> responseList =
                new ArrayList<>();

        for (LeaveRequest leave : leaves) {
            responseList.add(convertToDTO(leave));
        }

        return responseList;
    }

    @Override
    @Transactional
    public LeaveResponseDTO approveLeaveRequest(
            Long leaveId) {

        LeaveRequest leaveRequest =
                leaveRequestRepository.findById(leaveId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Leave request not found"));

        // Only PENDING requests can be approved
        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new RuntimeException(
                    "Only pending leave requests can be approved");
        }

        leaveRequest.setStatus(LeaveStatus.APPROVED);
        leaveRequest.setReviewedAt(LocalDateTime.now());

        LeaveRequest updatedLeave =
                leaveRequestRepository.save(leaveRequest);

        return convertToDTO(updatedLeave);
    }

    @Override
    @Transactional
    public LeaveResponseDTO rejectLeaveRequest(
            Long leaveId) {

        LeaveRequest leaveRequest =
                leaveRequestRepository.findById(leaveId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Leave request not found"));

        // Only PENDING requests can be rejected
        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new RuntimeException(
                    "Only pending leave requests can be rejected");
        }

        leaveRequest.setStatus(LeaveStatus.REJECTED);
        leaveRequest.setReviewedAt(LocalDateTime.now());

        LeaveRequest updatedLeave =
                leaveRequestRepository.save(leaveRequest);

        return convertToDTO(updatedLeave);
    }

    // Convert LeaveRequest entity to LeaveResponseDTO
    private LeaveResponseDTO convertToDTO(
            LeaveRequest leave) {

        LeaveResponseDTO dto =
                new LeaveResponseDTO();

        dto.setId(leave.getId());

        dto.setEmployeeName(
                leave.getEmployee().getName());

        dto.setLeaveType(
                leave.getLeaveType());

        dto.setStartDate(
                leave.getStartDate());

        dto.setEndDate(
                leave.getEndDate());

        dto.setReason(
                leave.getReason());

        dto.setStatus(
                leave.getStatus());

        dto.setCreatedAt(
                leave.getCreatedAt());

        dto.setReviewedAt(
                leave.getReviewedAt());

        return dto;
    }
}