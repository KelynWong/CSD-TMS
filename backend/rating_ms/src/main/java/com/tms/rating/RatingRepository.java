package com.tms.rating;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RatingRepository extends JpaRepository<Rating, String>{
    
    @Query("SELECT r FROM Rating r WHERE r.id IN :playerIds ORDER BY r.rating DESC")
    List<Rating> findAllByIdOrderByRatingDesc(@Param("playerIds") List<String> playerIds);

}