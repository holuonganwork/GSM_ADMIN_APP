package com.greensm.compliance.repository;

import com.greensm.compliance.domain.FraudCase;
import com.greensm.compliance.domain.enums.CaseSeverity;
import com.greensm.compliance.domain.enums.CaseStatus;
import com.greensm.compliance.domain.enums.FraudType;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FraudCaseRepository extends JpaRepository<FraudCase, String> {

    List<FraudCase> findByStatus(CaseStatus status);

    long countByStatus(CaseStatus status);

    @Query("SELECT c FROM FraudCase c WHERE " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:fraudType IS NULL OR c.fraudType = :fraudType) AND " +
           "(:severity IS NULL OR c.severity = :severity) AND " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(c.id) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "c.driver.cccd LIKE CONCAT('%', :search, '%') OR " +
           "LOWER(c.driver.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.driver.plate) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.driver.id) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.fraudTypeLabel) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<FraudCase> findFiltered(
        @Param("status") CaseStatus status,
        @Param("fraudType") FraudType fraudType,
        @Param("severity") CaseSeverity severity,
        @Param("search") String search
    );

    @Query("SELECT c FROM FraudCase c WHERE c.driver.cccd = :cccd")
    List<FraudCase> findByDriverCccd(@Param("cccd") String cccd);
}
