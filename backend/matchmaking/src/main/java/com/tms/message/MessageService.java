package com.tms.message;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;
import software.amazon.awssdk.services.sqs.model.SendMessageResponse;
import software.amazon.awssdk.services.sqs.model.SqsException;

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
            System.out.println("Sending message: " + messageBody);
            // Build the SendMessageRequest with the target SQS queue URL and message body
            SendMessageRequest sendMsgRequest = SendMessageRequest.builder()
                    .queueUrl("https://sqs.ap-southeast-1.amazonaws.com/654654510601/email-queue")
                    .messageBody(messageBody)
                    .build();

            // Send the message to SQS and capture the response
            SendMessageResponse sendMsgResponse = sqsClient.sendMessage(sendMsgRequest);
            System.out.println("Message sent with ID: " + sendMsgResponse.messageId());

        } catch (JsonProcessingException e) {
            // Handle JSON processing errors
            System.err.println("Failed to process message data as JSON: " + e.getMessage());
            e.printStackTrace();
        } catch (SqsException e) {
            // Handle SQS client-related errors
            System.err.println("Failed to send message to SQS: " + e.awsErrorDetails().errorMessage());
            e.printStackTrace();
        } catch (Exception e) {
            // Handle any other unforeseen errors
            System.err.println("An unexpected error occurred: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
