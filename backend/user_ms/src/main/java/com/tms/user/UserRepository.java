package com.tms.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    User findByUsername(String username);
    List<User> findByRole(Role role);

    @Query("SELECT u, RANK() OVER (ORDER BY r.rating DESC) as rank FROM User u JOIN u.rating r ORDER BY r.rating DESC")
    List<Object[]> findAllOrderByRatingDesc();

    @Query("SELECT u FROM User u JOIN u.rating r WHERE u.id IN :ids ORDER BY r.rating DESC")
    List<User> findByIdInOrderByRatingDesc(@Param("ids") List<String> ids);

    @Query("SELECT sub.rnk FROM (SELECT u.id as uid, RANK() OVER (ORDER BY r.rating DESC) AS rnk FROM User u JOIN u.rating r) sub WHERE sub.uid = :userId")
    Optional<Integer> findUserRankById(@Param("userId") String userId);

    @Query("SELECT sub.uid, sub.rnk FROM (SELECT u.id as uid, RANK() OVER (ORDER BY r.rating DESC) AS rnk FROM User u JOIN u.rating r) sub WHERE sub.uid IN :userIds")
    List<Object[]> findUserRanksByIds(@Param("userIds") List<String> userIds);

}
