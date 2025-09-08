package org.example.restaurantbooksystem.services;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import org.example.restaurantbooksystem.classes.Reservation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    public void sendReservationUpdateEmail(Reservation reservation) {
        try {
            logger.info("Sending update email to: {}", reservation.getEmail());
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(reservation.getEmail());
            message.setSubject("Reservation Update Notification");
            message.setText(
                    "Dear " + reservation.getName() + " " + reservation.getSurname() + ",\n\n" +
                            "Your reservation has been updated successfully. Below are the updated details:\n" +
                            "Reservation ID: " + reservation.getId() + "\n" +
                            "Table Number: " + reservation.getTableNumber() + "\n" +
                            "Number of People: " + reservation.getPeople() + "\n" +
                            "Surname: " + reservation.getSurname() + "\n" +
                            "Name: " + reservation.getName() + "\n" +
                            "Phone: " + reservation.getPhone() + "\n" +
                            "Email: " + reservation.getEmail() + "\n" +
                            "Notes: " + (reservation.getNotes() != null ? reservation.getNotes() : "None") + "\n" +
                            "Date: " + reservation.getDate() + "\n" +
                            "Time: " + reservation.getTime() + "\n\n" +
                            "Thank you for choosing us!\n" +
                            "Restaurant Reservation System"
            );
            mailSender.send(message);
            logger.info("Email sent successfully to: {}", reservation.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send email to {}: {}", reservation.getEmail(), e.getMessage(), e);
            throw e;
        }
    }
    public void sendVerificationEmail(Reservation reservation) {
        try {
            logger.info("Sending verification email to: {}", reservation.getEmail());
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(reservation.getEmail());
            helper.setSubject("Reservation Confirmation");

            String emailText =
                    "Dear " + reservation.getName() + " " + reservation.getSurname() + ",\n\n" +
                            "Your reservation has been confirmed! Below are your reservation details:\n" +
                            "Reservation ID: " + reservation.getId() + "\n" +
                            "Table Number: " + reservation.getTableNumber() + "\n" +
                            "Number of People: " + reservation.getPeople() + "\n" +
                            "Surname: " + reservation.getSurname() + "\n" +
                            "Name: " + reservation.getName() + "\n" +
                            "Phone: " + reservation.getPhone() + "\n" +
                            "Email: " + reservation.getEmail() + "\n" +
                            "Notes: " + (reservation.getNotes() != null ? reservation.getNotes() : "None") + "\n" +
                            "Date: " + reservation.getDate() + "\n" +
                            "Time: " + reservation.getTime() + "\n\n" +
                            "Please show this confirmation at the entrance.\n" +
                            "Scan the attached QR code to verify your reservation.\n\n" +
                            "Thank you for choosing us!\n" +
                            "Restaurant Reservation System";

            helper.setText(emailText);

            // Δημιουργία QR Code
            String qrText = "http://localhost:8081/pages/verification.html?reservationId=" + reservation.getId();
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(qrText, BarcodeFormat.QR_CODE, 150, 150);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", baos);
            byte[] qrCodeBytes = baos.toByteArray();

            // Επισύναψη QR Code
            helper.addAttachment("reservation-qr-code.png", new ByteArrayResource(qrCodeBytes));

            mailSender.send(message);
            logger.info("Verification email with QR code sent successfully to: {}", reservation.getEmail());

        } catch (MessagingException e) {
            logger.error("Failed to send verification email: {}", e.getMessage(), e);
        } catch (WriterException | IOException e) {
            logger.error("Error generating QR Code: {}", e.getMessage(), e);
        }
    }
}
