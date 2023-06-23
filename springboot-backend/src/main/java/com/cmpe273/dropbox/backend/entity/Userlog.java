package com.cmpe273.dropbox.backend.entity;


import lombok.Data;

import javax.persistence.*;

@Entity // This tells Hibernate to make a table out of this class
@Table(name = "userlog")
@Data
public class Userlog {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Integer id;
    @Column(name = "email")
    private String email;
    @Column(name = "filename")
    private String filename;
    @Column(name = "filepath")
    private String filepath;
    @Column(name = "isfile")
    private String isfile;
    @Column(name = "action")
    private String action;
    @Column(name = "actiontime")
    private String actiontime;

}