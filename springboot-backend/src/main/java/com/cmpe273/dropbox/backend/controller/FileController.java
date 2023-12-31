package com.cmpe273.dropbox.backend.controller;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GetObjectMetadataRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.cmpe273.dropbox.backend.S3.FileUploader;
import com.cmpe273.dropbox.backend.S3.S3Config;
import com.cmpe273.dropbox.backend.entity.Userfiles;
import com.cmpe273.dropbox.backend.entity.Userlog;
import com.cmpe273.dropbox.backend.entity.Users;
import com.cmpe273.dropbox.backend.service.FileService;
import com.cmpe273.dropbox.backend.service.UserFilesService;
import com.cmpe273.dropbox.backend.service.UserLogService;
import com.cmpe273.dropbox.backend.service.UserService;
import com.google.gson.Gson;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.S3Exception;

import javax.servlet.http.HttpSession;
import java.io.*;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Controller
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping(path="/files")
public class FileController {
    @Autowired
    private FileService fileService;

    @Autowired
    private UserFilesService userFilesService;

    @Autowired
    private UserLogService userLogService;

    @Autowired
    private UserService userService;

    //Save the uploaded file to this folder
    private static String UPLOADED_FOLDER = "./public/uploads/";
    private static final String S3_BUCKET_NAME = "bitirmes3";
    private final S3Client s3Client;

    @Autowired
    public FileController(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = "application/json")
    public ResponseEntity<com.cmpe273.dropbox.backend.entity.Files> fileupload(@RequestParam("file") MultipartFile multipartFile,
                                                                               @RequestParam("fileparent") String fileparent, HttpSession session) throws JSONException {

        String email = (String) session.getAttribute("email");
        com.cmpe273.dropbox.backend.entity.Files newFile = new com.cmpe273.dropbox.backend.entity.Files();

        // Dosya yolu veya adı
        String filepath = "";
        if (!StringUtils.isEmpty(fileparent)) {
            filepath = fileparent + "/" + multipartFile.getOriginalFilename();
        } else {
            filepath = email+ "/" + multipartFile.getOriginalFilename();
        }

        System.out.println(multipartFile.getOriginalFilename() + " Yükleme Başarılı...");

        // Dosyayı Amazon S3'ye yükleme
        FileUploader.uploadFile(multipartFile, filepath);

        // Dosya bilgilerini MySQL veritabanına kaydetme
        newFile.setFilename(multipartFile.getOriginalFilename());
        newFile.setFileparent(fileparent);
        newFile.setIsfile("T");
        newFile.setOwner(email);
        newFile.setSharedcount(0);
        newFile.setStarred("F");
        newFile.setFilepath(filepath);

        fileService.uploadFile(newFile);

        Userfiles userfiles = new Userfiles();
        userfiles.setEmail(email);
        userfiles.setFilepath(filepath);
        userFilesService.addUserFile(userfiles);

        Userlog userlog = new Userlog();
        userlog.setAction("File Upload");
        userlog.setEmail(email);
        userlog.setFilename(multipartFile.getOriginalFilename());
        userlog.setFilepath(filepath);
        userlog.setIsfile("F");
        userlog.setActiontime(new Date().toString());
        userLogService.addUserLog(userlog);

        return new ResponseEntity<com.cmpe273.dropbox.backend.entity.Files>(newFile, HttpStatus.OK);
    }


    @GetMapping(path = "/getfolderfiles", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<com.cmpe273.dropbox.backend.entity.Files>> getFilesInFolder(@RequestParam String filepath) {

        //  JSONObject jObject = new JSONObject(filepath);

        List<com.cmpe273.dropbox.backend.entity.Files> filesList = fileService.getFileByFileparent(filepath);

        return new ResponseEntity(filesList, HttpStatus.OK);
    }

    @GetMapping(path = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<com.cmpe273.dropbox.backend.entity.Files>> getUserFiles(HttpSession session) {

        String email = (String) session.getAttribute("email");
        if(email==null){
            return new ResponseEntity(null, HttpStatus.UNAUTHORIZED);
        }
        List<Userfiles> userFilesList = userFilesService.getUserFilesByEmail(email);

        List<com.cmpe273.dropbox.backend.entity.Files> filesList = new ArrayList<>();
        for (Userfiles userfiles : userFilesList) {

            com.cmpe273.dropbox.backend.entity.Files file = fileService.getFileByFilepath(userfiles.getFilepath(), "");
            if(file!=null)
                filesList.add(file);
        }

        return new ResponseEntity(filesList, HttpStatus.OK);
    }


    @PostMapping(path = "/delete", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deleteFile(@RequestBody com.cmpe273.dropbox.backend.entity.Files file, HttpSession session) throws JSONException {
        System.out.println(file.getFilepath());

        String email = (String) session.getAttribute("email");

        if (email == null) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        // Dosya yolu ve adı
        String filepath =file.getOwner().split("\\.")[0] + "/" + file.getFilename();
        Path path = Paths.get(filepath);

        if (file.getOwner().equals(email)) {
            try {
                if (Files.isDirectory(path)) {
                    // Klasörü ve içindeki dosyaları ve klasörleri silmek için recursiveDelete metodu kullanılıyor
                    recursiveDelete(path);
                } else {
                    // Sadece bir dosya ise doğrudan sil
                    Files.deleteIfExists(path);
                    System.out.println(path);  // Dosya ismini konsola yazdır
                }

                // Dosyayı AWS S3'den silme
                FileUploader.deleteFile(filepath);

                // MySQL veritabanından dosyayı silme
                userFilesService.deleteUserFilesByFilepath(file.getFilepath());
                fileService.deleteFile(file.getFilepath());

                Userlog userlog = new Userlog();
                userlog.setEmail(email);
                userlog.setFilename(file.getFilename());
                userlog.setFilepath(filepath);
                if (file.getIsfile().equals("T")) {
                    userlog.setAction("File Delete");
                } else {
                    userlog.setAction("Folder Delete");
                }
                userlog.setActiontime(new Date().toString());
                userlog.setIsfile(file.getIsfile());
                userLogService.addUserLog(userlog);

                return new ResponseEntity<>(null, HttpStatus.OK);
            } catch (IOException e) {
                e.printStackTrace();
                return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
            }
        } else {
            userFilesService.deleteUserFilesByEmailAndFilepath(file.getFilepath(), email);
            fileService.updateSharedCount(file.getFilepath(), file.getSharedcount() - 1);
            return new ResponseEntity<>(null, HttpStatus.OK);
        }
    }


    private void recursiveDelete(Path path) throws IOException {
        if (Files.isDirectory(path)) {
            try (DirectoryStream<Path> entries = Files.newDirectoryStream(path)) {
                for (Path entry : entries) {
                    recursiveDelete(entry);
                }
            }
        }

        Files.deleteIfExists(path);
        System.out.println(path);  // Klasör veya dosya ismini konsola yazdır
    }

    @PostMapping(path = "/sharefile", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> shareFile(@RequestBody String data, HttpSession session) throws JSONException {

        JSONObject jObject = new JSONObject(data);
        Gson gson = new Gson();
        JSONObject filedata = (JSONObject) jObject.get("filedata");
        com.cmpe273.dropbox.backend.entity.Files file = gson.fromJson(filedata.toString(), com.cmpe273.dropbox.backend.entity.Files.class);
        String shareEmail = jObject.getString("shareEmail");

        Users user = userService.getUserDetails(shareEmail);

        if(user==null){

            return new ResponseEntity(null, HttpStatus.UNAUTHORIZED);

        }

        String email = (String) session.getAttribute("email");

        if(email==null){
            return new ResponseEntity(null, HttpStatus.UNAUTHORIZED);
        }

        Userfiles userfiles = new Userfiles();

        userfiles.setEmail(shareEmail);
        userfiles.setFilepath(file.getFilepath());

        userFilesService.addUserFile(userfiles);

        fileService.updateSharedCount(file.getFilepath(), file.getSharedcount() + 1);


        Userlog userlog = new Userlog();

        userlog.setEmail(email);
        userlog.setFilename(file.getFilename());
        userlog.setFilepath(file.getFilepath());
        if(file.getIsfile().equals("T"))
            userlog.setAction("File shared with "+shareEmail);

        else
            userlog.setAction("Folder shared with "+shareEmail);

        userlog.setActiontime(new Date().toString());
        userlog.setIsfile(file.getIsfile());
        userLogService.addUserLog(userlog);

        return new ResponseEntity(null, HttpStatus.OK);

    }

    @PostMapping(path = "/makefolder", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<com.cmpe273.dropbox.backend.entity.Files> makeFolder(@RequestBody String data, HttpSession session) throws JSONException, IOException {

        JSONObject jObject = new JSONObject(data);
        String folderName = jObject.getString("filename");
        String folderparent = jObject.getString("fileparent");
        String email = (String) session.getAttribute("email");

        if(email==null){
            return new ResponseEntity(null, HttpStatus.UNAUTHORIZED);
        }

        String folderpath = "./public/uploads/" + email.split("\\.")[0]+"/"+folderName;

        com.cmpe273.dropbox.backend.entity.Files file= new com.cmpe273.dropbox.backend.entity.Files();

        file.setFilename(folderName);
        file.setFilepath(folderpath);
        file.setSharedcount(0);
        file.setOwner(email);
        file.setFileparent(folderparent);
        file.setStarred("F");
        file.setIsfile("F");

        Path path = Paths.get(folderpath);
        Files.createDirectories(path);

        fileService.uploadFile(file);

        Userfiles userfiles = new Userfiles();

        userfiles.setEmail(email);
        userfiles.setFilepath(folderpath);

        userFilesService.addUserFile(userfiles);

        Userlog userlog = new Userlog();

        userlog.setEmail(email);
        userlog.setFilename(file.getFilename());
        userlog.setFilepath(file.getFilepath());
        userlog.setAction("Make Folder");
        userlog.setActiontime(new Date().toString());
        userlog.setIsfile("F");
        userLogService.addUserLog(userlog);


        return new ResponseEntity(file, HttpStatus.OK);

    }

    @PostMapping(path = "/star", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> starFile(@RequestBody String data) throws JSONException {

        JSONObject jObject = new JSONObject(data);
        String filepath = jObject.getString("filepath");
        String starred = jObject.getString("starred");

        fileService.markStar(filepath, starred);
        return new ResponseEntity(null, HttpStatus.OK);

    }

    @GetMapping(path = "/{filename}"/*, produces = MediaType.APPLICATION_JSON_VALUE*/)
    public ResponseEntity<InputStreamResource> downloadFile(@RequestParam String filepath, @PathVariable("filename") String filename) {

        File file2Upload = new File(filepath);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
        headers.set(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=" + filename.replace(" ", "_"));
        headers.add("Pragma", "no-cache");
        headers.add("Expires", "0");
        InputStreamResource resource = null;
        try {
            resource = new InputStreamResource(new FileInputStream(file2Upload));
        } catch (FileNotFoundException e) {
            e.printStackTrace();

            return new ResponseEntity(null, HttpStatus.UNAUTHORIZED);

        }

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(file2Upload.length())
                .contentType(MediaType.parseMediaType("application/octet-stream"))
                .body(resource);
    }
}

