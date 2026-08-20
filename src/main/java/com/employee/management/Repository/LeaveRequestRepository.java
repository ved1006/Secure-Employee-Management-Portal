package com.employee.management.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.employee.management.Model.LeaveRequest;

public interface LeaveRequestRepository
        extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByEmployee_Id(int employeeId);

}