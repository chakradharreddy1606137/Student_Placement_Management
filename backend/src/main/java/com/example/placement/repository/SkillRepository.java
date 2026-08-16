package com.example.placement.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.placement.model.Skill;

public interface SkillRepository extends JpaRepository<Skill, Long> {
}
