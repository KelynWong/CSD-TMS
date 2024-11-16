package com.tms.message;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tms.match.MatchJson;
import com.tms.player.Player;
import com.tms.tournament.Tournament;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;
import software.amazon.awssdk.services.sqs.model.SendMessageResponse;
import software.amazon.awssdk.services.sqs.model.SqsException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Component
public class MessageService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private SqsClient getClient() {
        return SqsClient.builder().region(Region.AP_SOUTHEAST_1).credentialsProvider(DefaultCredentialsProvider.create()).build();
    }

    public void sendMessage(MessageData messageData) {
        SqsClient sqsClient = getClient();
        try {
            // Convert the message data to JSON format
            String messageBody = objectMapper.writeValueAsString(messageData);
            // Build the SendMessageRequest with the target SQS queue URL and message body
            SendMessageRequest sendMsgRequest = SendMessageRequest.builder()
                    .queueUrl("https://sqs.ap-southeast-1.amazonaws.com/654654510601/email-queue")
                    .messageBody(messageBody)
                    .build();

            // Send the message to SQS and capture the response
            SendMessageResponse sendMsgResponse = sqsClient.sendMessage(sendMsgRequest);

        } catch (JsonProcessingException e) {
            // Handle JSON processing errors
        } catch (SqsException e) {
            // Handle SQS client-related errors
        } catch (Exception e) {
            // Handle any other unforeseen errors
        }
    }

    public void sendMessagesToSQS(Tournament tournament, List<MatchJson> matches, Map<String, Player> idToPlayer, double numRounds) {
        String emailContent = formatMessage(tournament, matches, idToPlayer, numRounds);
        String tournamentName = tournament.getTournamentName();
        for (Player player : idToPlayer.values()) {
            MessageData messageData = new MessageData(player.getEmail(),tournamentName , emailContent, String.format("[TMS] " +
                    "%s matched 🏸", tournamentName));
            sendMessage(messageData);
        }
    }

    private String formatMessage(Tournament tournament, List<MatchJson> matches, Map<String, Player> idToPlayer,
                            double numRounds) {
        String tournamentName = tournament.getTournamentName();
        Long tournamentId = tournament.getId();
        LocalDateTime startDT = tournament.getStartDT();
        LocalDateTime endDT = tournament.getEndDT();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d MMMM yyyy");
        String formattedStartDT = startDT.format(formatter);
        String formattedEndDT = endDT.format(formatter);

        String tableHTML = convertTournamentToHTML(matches, idToPlayer, numRounds);

        return String.format(
                "<html>" +
                        "  <body style=\"font-size: 16px;\">" +
                        "    <img src=\"https://csd-tms-email-image.s3.ap-southeast-1.amazonaws.com/logo.png\" alt=\"Tournament Banner\" style=\"width: 100%%; max-width: 200px; border-radius: 8px; margin: 15px 0;\"/>" +
                        "    <h1>[%s] Draw Completed</h1>" +
                        "    <p>Congratulations! You have been matched in the tournament.</p>" +
                        "    <div style=\"padding: 10px 0; margin: 10px 0; font-family: Norwester, sans-serif;\">" +
                        "      <h2>Tournament Details</h2>" +
                        "      <p><strong>Tournament Name:</strong> %s</p>" +
                        "      <p><strong>Date:</strong> %s to %s</p>" +
                        "      %s" +
                        "    </div>" +
                        "    <p>For more information, click <a href=\"https://csd-tms.vercel.app/tournaments/%d\">here</a>!</p>" +
                        "  </body>" +
                        "</html>",
                tournamentName, tournamentName, formattedStartDT, formattedEndDT, tableHTML, tournamentId
        );
    }

    /**
     * Convert the tournament to HTML table format
     * @param matches list of matches for this tournament
     * @param idToPlayer map of playerIds to player objects
     * @param numRounds number of rounds in the tournament
     * @return HTML table string
     */
    private String convertTournamentToHTML(List<MatchJson> matches, Map<String, Player> idToPlayer, double numRounds) {
        StringBuilder sb = new StringBuilder();

        // Start HTML
        sb.append("<h2>Tournament Bracket</h2>");
        sb.append("<table class=\"bracket\" border=\"1\" style=\"border-collapse: collapse;\">");

        // Generate header
        sb.append("<thead><tr>");
        for (int i = 1; i <= numRounds; i++) {
            sb.append("<th scope=\"col\" style=\"padding:5px;\">Round ").append(i).append("</th>");
        }
        sb.append("</tr></thead>");

        // Generate body
        sb.append("<tbody>");

        int numBaseMatches = (matches.size() + 1) / 2;

        for (int i = 0; i < numBaseMatches; i++) {
            // First player row
            sb.append("<tr>");
            double numLoops = calculateNumLoops(i, numBaseMatches, numRounds);

            for (int round = 0; round < numLoops; round++) {
                int rowspan = (int) Math.pow(2, round);
                sb.append("<td style=\"padding:5px;\" rowspan=\"").append(rowspan).append("\">");
                if (round == 0) {
                    // First round always shows player 1
                    Player player = idToPlayer.get(matches.get(i).getPlayer1Id());
                    String name = (player == null) ? "<i>Bye</i>" : player.getFullname();
                    sb.append("<span>").append(name).append("</span>");
                }
                sb.append("</td>");
            }
            sb.append("</tr>");

            // Second player row (only for first round)
            sb.append("<tr>");
            Player player = idToPlayer.get(matches.get(i).getPlayer2Id());
            String name = (player == null) ? "<i>Bye</i>" : player.getFullname();
            sb.append("<td style=\"padding:5px;\"><span>").append(name).append("</span></td>");
            sb.append("</tr>");
        }

        sb.append("</tbody></table>");
        return sb.toString();
    }

    private double calculateNumLoops(int i, int numBaseMatches, double numRounds) {
        for (int j = 1; j <= numRounds; j++) {
            if (i % (numBaseMatches / Math.pow(2, j)) == 0) {
                return numRounds - (j - 1);
            }
        }
        return numRounds;
    }
}
