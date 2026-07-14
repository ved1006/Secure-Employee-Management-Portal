package com.employee.management.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component      //not a service but itt is injected in SecurityConfig.java
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final CustomerUserDetailsService customerUserDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, CustomerUserDetailsService customerUserDetailsService){
        this.jwtService = jwtService;
        this.customerUserDetailsService = customerUserDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException,IOException{
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        filterChain.doFilter(request, response);
        return;
    }
    String jwt = authHeader.substring(7); //remmoved bearer (token type)
    String email = jwtService.extractUsername(jwt);
    if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

        // Load user from database
        UserDetails userDetails = customerUserDetailsService.loadUserByUsername(email);

        //think of it as a spring identity card for validtiom
        UsernamePasswordAuthenticationToken authentication =
        new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
       );

       //stores the request related informationn jaise ip address wagera
       authentication.setDetails(
        new WebAuthenticationDetailsSource()
                .buildDetails(request)
       );

       //authenticates the req
       SecurityContextHolder
        .getContext()
        .setAuthentication(authentication);


    }
    // jwtFilter -> employee controller
    filterChain.doFilter(request, response);
    }
}
