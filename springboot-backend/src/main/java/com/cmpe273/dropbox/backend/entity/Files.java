package com.cmpe273.dropbox.backend.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "files")
@Data
public class Files {

    @Column(name ="firstname")
    String filename;

    @Id
    @Column(name ="filepath")
    String filepath;

    @Column(name ="fileparent")
    String fileparent;

    @Column(name ="isfile")
    String isfile;

    @Column(name ="owner")
    String owner;

    @Column(name ="starred")
    String starred;

    @Column(name ="sharedcount")
    Integer sharedcount;
}
