package com.privhealthai.doctor.entity;

import com.privhealthai.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "doctors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorEntity extends BaseEntity {

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String specialization;

    @Column
    private String qualification;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column
    private String city;

    @Column
    private String country;

    @Column
    private String hospital;

    @Column(name = "contact_info")
    private String contactInfo;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating;

    @Column(name = "license_number", nullable = false, unique = true)
    private String licenseNumber;
}
