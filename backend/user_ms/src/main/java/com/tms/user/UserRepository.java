package com.tms.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> { 
    User findByUsername(String username);
    List<User> findByRole(Role role);
    List<User> findByIdIn(List<String> ids);

    @Query("SELECT u, RANK() OVER (ORDER BY r.rating DESC) as rank FROM User u JOIN u.rating r WHERE u.id = :userId")
    Optional<Object[]> findUserRankById(@Param("userId") String userId);

    @Query("SELECT u, RANK() OVER (ORDER BY r.rating DESC) as rank FROM User u JOIN u.rating r WHERE u.id IN :ids ORDER BY r.rating DESC")
    List<Object[]> findByIdInOrderByRatingDesc(@Param("ids") List<String> ids);

    @Query("SELECT u, RANK() OVER (ORDER BY r.rating DESC) as rank FROM User u JOIN u.rating r ORDER BY r.rating DESC")
    List<Object[]> findAllOrderByRatingDesc();

}
