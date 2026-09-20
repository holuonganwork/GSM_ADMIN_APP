package com.greensm.compliance.repository;

import com.greensm.compliance.domain.Operator;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OperatorRepository extends JpaRepository<Operator, String> {
    Optional<Operator> findByCode(String code);
}
