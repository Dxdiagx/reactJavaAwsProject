package com.cmpe273.dropbox.backend.S3;

import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

// ...

public class FileUploader {

    public static void uploadFile(MultipartFile multipartFile, String filepath) {
        try {
            byte[] bytes = multipartFile.getBytes();

            // AWS S3'ye dosya yükleme işlemi
            S3Client s3Client = S3Client.builder()
                    .region(Region.EU_NORTH_1)
                    .credentialsProvider(DefaultCredentialsProvider.create())
                    .build();

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket("bitirmes3")
                    .key(filepath)
                    .build();

            RequestBody requestBody = RequestBody.fromBytes(bytes);
            PutObjectResponse response = s3Client.putObject(putObjectRequest, requestBody);

            // Dosya yükleme işlemleri tamamlandıktan sonra yapılacak diğer işlemler

        } catch (IOException e) {
            e.printStackTrace();
            // Dosya yükleme hatası
        }
    }
    // Dosya silme metodu
    public static void deleteFile(String filepath) {
        try {
            // AWS S3'den dosya silme işlemi
            S3Client s3Client = S3Client.builder()
                    .region(Region.EU_NORTH_1)
                    .credentialsProvider(DefaultCredentialsProvider.create())
                    .build();

            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket("bitirmes3")
                    .key(filepath)
                    .build();

            DeleteObjectResponse response = s3Client.deleteObject(deleteObjectRequest);

            // Dosya silme işlemleri tamamlandıktan sonra yapılacak diğer işlemler

        } catch (Exception e) {
            e.printStackTrace();
            // Dosya silme hatası
        }
    }
    public static void downloadFile(String filepath, String destinationPath) {
        try {
            // AWS S3'den dosya indirme işlemi
            S3Client s3Client = S3Client.builder()
                    .region(Region.EU_NORTH_1)
                    .credentialsProvider(DefaultCredentialsProvider.create())
                    .build();

            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket("bitirmes3")
                    .key(filepath)
                    .build();

            ResponseInputStream<GetObjectResponse> responseInputStream = s3Client.getObject(getObjectRequest);

            // Dosyayı belirtilen hedef yoluna kaydetme
            Path destination = Paths.get(destinationPath);
            FileOutputStream fileOutputStream = new FileOutputStream(destination.toFile());

            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = responseInputStream.read(buffer)) != -1) {
                fileOutputStream.write(buffer, 0, bytesRead);
            }

            fileOutputStream.close();

            // Dosya indirme işlemi tamamlandıktan sonra yapılacak diğer işlemler

        } catch (IOException e) {
            e.printStackTrace();
            // Dosya indirme hatası
        }
    }}

