package com.tms.tournament;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.exceptions.base.MockitoException;
import org.mockito.junit.jupiter.MockitoExtension;

// @ExtendWith(MockitoException.class)
public class TournamentServiceTest {
    
    // @Mock
    // private TournamentRepository tournaments;
    // @InjectMocks
    // private TournamentServiceImpl tournamentService;
    // /* Unit Testing */
    // /* addTournament() BLACKLIST
    //  *  - tournament tile cannot be empty
    //  *  - tournament title needs to be unique
    //  *  - tournament startDT cannot be aft tournament endDT
    //  *  - tournament regStartDT cannot be after tournament regEndDT
    //  *  - regStartDT n regEndDT cannot be after tournament startDT
    //  */
    // @Test
    // void addTournament_AllGood_ReturnSavedTournament() {
    //     // Arrange
        
    //     // Act 
    //     // Assert
    // }
    // @Test
    // void addTournament_SameName_ReturnNull() {
    //     // Arrange
    //     Tournament tournament = new Tournament("New Tournament");
    //     List<Tournament> tournamentOfSameName = new ArrayList<>();
    //     tournamentOfSameName.add(tournament);

    //     // mock the "findbytitle" operation
    //     when(books.findByTournamentName(any(String.class))).thenReturn(booksOfSameTitle);
    //     // Act 
    //     Book savedBook = bookService.addBook(book);
    //     // Assert
    //     assertNull(savedBook);
    //     verify(books).findByTitle(book.getTitle());
    // }
    // @Test
    // void addTournament_EmptyTitle_ReturnNull() {
    // }
    // @Test
    // void addTournament_startDTAftEndDT_ReturnNull() {
    // }
    // @Test
    // void addTournament_regStartDTAftRegEndDT_ReturnNull() {
        
    // }
    // @Test
    // void addTournament_regStartAndEndDTAftRegStartAndEndDT_ReturnNull() {
        
    // }
    // /* updateTournament() BLACKLIST
    //  *  - tournament tile cannot be empty
    //  *  - tournament title needs to be unique
    //  *  - tournament startDT cannot be aft tournament endDT
    //  *  - tournament regStartDT cannot be after tournament regEndDT
    //  *  - regStartDT n regEndDT cannot be after tournament startDT
    //  */
    // @Test
    // void updateTournament_AllGood_returnSavedTournament() {
    
    // }
    // @Test
    // void updateTournament_WrongInput_ReturnNull() {
        
    // }
    // @Test
    // void updateTournament_NotFound_ReturnNull() {
    // }
}