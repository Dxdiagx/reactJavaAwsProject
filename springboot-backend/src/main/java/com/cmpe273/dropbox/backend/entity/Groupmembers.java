package com.cmpe273.dropbox.backend.entity;


import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "groupmembers")
@Data
public class Groupmembers {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Column(name ="id")
    private int id;

    @Column(name ="groupid")
    int groupid;

    @Column(name ="email")
    String email;
}
