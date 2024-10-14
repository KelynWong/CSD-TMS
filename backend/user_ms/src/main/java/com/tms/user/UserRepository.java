package com.tms.user;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    List<User> findByRoleIgnoreCase(String role);
    List<User> findByIdIn(List<Long> ids);
}

