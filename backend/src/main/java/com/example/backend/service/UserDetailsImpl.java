package com.example.backend.service;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.backend.model.Role;

public class UserDetailsImpl implements UserDetails {

    private final String username;
    private final String password;
    private final SimpleGrantedAuthority authority;

    public UserDetailsImpl(String username, String password, Role role) {
        this.username = username;
        this.password = password;
        this.authority = new SimpleGrantedAuthority(role.getRoleName()); // e.g. "ROLE_ADMIN"
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // return a single-element list since user has only one role
        return List.of(authority);
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    // Required overrides — safe defaults
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
