package com.cmpe273.dropbox.backend.entity;
import lombok.Data;

import javax.persistence.*;

@Entity // This tells Hibernate to make a table out of this class
@Table(name = "users")
@Data
public class Users {

    @Column(name ="firstname")
    private String firstname;

    @Column(name ="lastname")
    private String lastname;

    @Id
    @Column(name ="email")
    private String email;

    @Column(name ="password")
    private String password;

    @Column(name ="contact")
    private String contact;
    @Column(name ="interests")
    private String interests;

    @Column(name ="lastlogin")
    private String lastlogin;
}