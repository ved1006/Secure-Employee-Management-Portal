package com.employee.management.security;

import java.util.Date;
import java.util.HashMap;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.employee.management.Model.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public String generateToken(User user){
        HashMap<String, Object> claims = new HashMap<>();
        claims.put("role",user.getRole());

        return Jwts.builder()
        .claims(claims)
        .subject(user.getEmail())
        .issuedAt(new Date())
        .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
        .signWith(getSignInKey())
        .compact();
    }
    private SecretKey getSignInKey(){
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String extractUsername(String token){
        return extractClaim(token,Claims::getSubject);
    }

    public <T> T extractClaim(String token,Function<Claims,T> claimResolver){
        Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }
     private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    private boolean isTokenExpired(String token) {

        return extractExpiration(token).before(new Date());
    }
    public boolean isTokenValid(String token,
                                UserDetails userDetails) {

        String username = extractUsername(token);

        return username.equals(userDetails.getUsername())
                && !isTokenExpired(token);
    }
    
}
