package com.greensm.compliance.repository;

import com.greensm.compliance.domain.Driver;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DriverRepository extends JpaRepository<Driver, String> {

    Optional<Driver> findByCccd(String cccd);

    Optional<Driver> findByPlate(String plate);

    @Query("SELECT d FROM Driver d WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           "LOWER(d.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "d.cccd LIKE CONCAT('%', :query, '%') OR " +
           "LOWER(d.plate) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "d.phone LIKE CONCAT('%', :query, '%') OR " +
           "LOWER(d.id) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.vehicleModel) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Driver> searchDrivers(@Param("query") String query);
}
