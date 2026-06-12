package com.privhealthai.doctor.repository;

import com.privhealthai.doctor.entity.DoctorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DoctorRepository extends JpaRepository<DoctorEntity, UUID>,
        JpaSpecificationExecutor<DoctorEntity> {

    List<DoctorEntity> findBySpecializationContainingIgnoreCase(String specialization);

    List<DoctorEntity> findByCityIgnoreCase(String city);

    List<DoctorEntity> findByCountryIgnoreCase(String country);

    boolean existsByLicenseNumber(String licenseNumber);
}
