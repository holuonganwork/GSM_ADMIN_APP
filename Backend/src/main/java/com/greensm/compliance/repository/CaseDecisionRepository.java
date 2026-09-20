package com.greensm.compliance.repository;

import com.greensm.compliance.domain.CaseDecision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CaseDecisionRepository extends JpaRepository<CaseDecision, Long> {

    @Query("SELECT COALESCE(SUM(d.fineAmount), 0) FROM CaseDecision d")
    Long sumTotalFines();
}
