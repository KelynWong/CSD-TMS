package com.tms.rating;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, String>{
    
    @Query("SELECT r FROM Rating r WHERE r.id IN :playerIds ORDER BY r.rating DESC")
    List<Rating> findAllByIdOrderByRatingDesc(@Param("playerIds") List<String> playerIds);

}