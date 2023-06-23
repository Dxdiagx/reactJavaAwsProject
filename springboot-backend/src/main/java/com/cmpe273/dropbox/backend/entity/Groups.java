package com.cmpe273.dropbox.backend.entity;


import lombok.Data;

import javax.persistence.*;
@Entity
@Table(name = "table_groups")
@Data
public class Groups {

    @Column(name ="groupname")
    String groupname;


    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Column(name ="groupid")
    int groupid;

    @Column(name ="membercount")
    Integer membercount;

    @Column(name ="owner")
    String owner;
}
