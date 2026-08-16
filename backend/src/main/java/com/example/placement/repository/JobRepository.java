package com.example.placement.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.placement.model.Job;

public interface JobRepository extends JpaRepository<Job, Long> {
}
