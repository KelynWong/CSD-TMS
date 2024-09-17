package main.java.com.tms.tournament;

import javax.annotation.processing.Generated;

@Entity
public class Tournament {
    @Id @GeneratedValue
    private long tournamentId;
    private String tournamentName;
    private String startDate;
    private String endDate;
    private String status; 

    private String[] statusArr = new String[] {"Scheduled", "Registration Start", "Registration Close", "In Progress", "Completed"};

}
