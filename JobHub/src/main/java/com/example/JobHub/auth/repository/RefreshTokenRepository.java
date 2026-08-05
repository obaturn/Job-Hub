package com.example.JobHub.auth.repository;

import com.example.JobHub.auth.entity.RefreshToken;
import com.example.JobHub.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    List<RefreshToken> findByUser_Id(Long userId);

    void deleteByUser(User user);
}
