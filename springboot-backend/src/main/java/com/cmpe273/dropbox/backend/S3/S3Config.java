package com.cmpe273.dropbox.backend.S3;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
@Configuration
public class S3Config {
      private static final String ACCESS_KEY = "SECRET_KEY";
    private static final String SECRET_KEY = "SECRET_KEY";
    public static final String BUCKET_NAME = "bitirmes3";
    private static final Region REGION = Region.EU_NORTH_1; // AWS bölgenizi buraya girin

    @Bean
    public static S3Client getS3Client() {
        return S3Client.builder()
                .region(REGION)
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(ACCESS_KEY, SECRET_KEY)))
                .build();

    }
}
