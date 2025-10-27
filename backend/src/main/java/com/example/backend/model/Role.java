package com.example.backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name="Roles", uniqueConstraints = {
    @UniqueConstraint(columnNames = "role_name")
})
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int roleId;

    @Column(nullable = false, unique = true)
    private String roleName;

    private String description;

    public int getRoleId() { return roleId; }
    public void setRoleId(int roleId) { this.roleId = roleId; }

    public String getRoleName() { return roleName; }
    public void setRoleName(String roleName) { this.roleName = roleName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

}
