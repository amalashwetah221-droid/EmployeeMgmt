package com.example.backend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.SignupDTO;
import com.example.backend.dto.UserDTO;
import com.example.backend.model.*;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.JwtService;

@RestController
@RequestMapping("/api")
public class UserInfoController {
	@Autowired
	UserRepository userInfoDao;

    @Autowired
    RoleRepository roledao;
	
	@Autowired
	JwtService jwtService;
	
	@Autowired
	AuthenticationManager authenticationManager;

    @Autowired
    PasswordEncoder passwordEncoder;
	
	@PostMapping("/validate")
	public ResponseEntity<String> validate(@RequestBody UserDTO userInfo){
		authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userInfo.getUsername(), userInfo.getPassword()));
		User userEntity = userInfoDao.findByUsername(userInfo.getUsername());
		String token = jwtService.generateToken(userEntity);
        return ResponseEntity.ok(token);
		
	}

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupDTO signupDTO)throws RuntimeException{
        User user= new User();
        user.setUsername(signupDTO.getUsername());
        user.setPassword(passwordEncoder.encode(signupDTO.getPassword()));
        user.setEmail(signupDTO.getEmail());
        
        Role role = roledao.findByRoleName(signupDTO.getRoleName());
        user.setRole(role);
        userInfoDao.save(user);
        return ResponseEntity.ok("Signup successful");
    }
}