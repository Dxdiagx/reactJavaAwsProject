package com.cmpe273.dropbox.backend.entity;


import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "userfiles")
@Data
public class Userfiles {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Column(name ="id")
    private int id;
    @Column(name ="filepath")
    String filepath;
    @Column(name ="email")
    String email;
}
