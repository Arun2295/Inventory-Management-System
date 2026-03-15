package com.example.inventory_management_system.Security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.util.HashMap;
import java.util.Map;
import java.util.Date;
import io.jsonwebtoken.Claims;
import java.util.function.Function;



@Component
public class JwtUtil {


    @Value("${Jwt.secret}")
    private String secret;

    @Value("${Jwt.expiration}")
    private long expiration;


    private SecretKey getSigningKey(){
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String email){
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, email);
    }
    public String createToken(Map<String,Object> claims, String email){
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();

    }
    public String extractEmail(String token){
        return extractClaim(token, Claims::getSubject);

    }
    public Date extractExpiration(String token){
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    public Claims extractAllClaims(String token){
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

    }
    private boolean istokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }
    public boolean validateToken(String token, UserDetails userDetails){
        final String email = extractEmail(token);
        return (email.equals(userDetails.getUsername()) && !istokenExpired(token));

    }
    public long getExpiration(){
        return expiration;
    }


}
