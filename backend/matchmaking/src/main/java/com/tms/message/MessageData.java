package com.tms.message;

import lombok.Data;

@Data
public class MessageData {
    private String recipientEmail;
    private String tournamentName;
    private String message;
    private String subject;

    public MessageData(String recipientEmail, String tournamentName, String message, String subject) {
        this.recipientEmail = recipientEmail;
        this.tournamentName = tournamentName;
        this.message = message;
        this.subject = subject;
    }

}


