package com.example.backend.service;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;


@Service
public class UserDetailsServiceImpl implements UserDetailsService{
	@Autowired
	UserRepository userInfoDao;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
	
		User userInfoEntity = userInfoDao.findByUsername(username);
		if(userInfoEntity==null){
            throw new RuntimeException();
        }
        return new UserDetailsImpl(userInfoEntity.getUsername(), userInfoEntity.getPassword(), userInfoEntity.getRole());
}
}