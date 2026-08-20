package com.employee.management.Service;

import java.util.List;

import com.employee.management.dto.LeaveRequestDTO;
import com.employee.management.dto.LeaveResponseDTO;

public interface LeaveRequestService {

    LeaveResponseDTO createLeaveRequest(
            String email,
            LeaveRequestDTO dto
    );

    List<LeaveResponseDTO> getMyLeaveRequests(
            String email
    );

    List<LeaveResponseDTO> getAllLeaveRequests();

    LeaveResponseDTO approveLeaveRequest(
            Long leaveId
    );

    LeaveResponseDTO rejectLeaveRequest(
            Long leaveId
    );
}