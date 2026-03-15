package com.example.inventory_management_system.Security;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.Cookie;

@Component
public class Cookies {

    public ResponseCookie createJwtcookie(String token){
        return ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(24*60*60)
                .build();
    }

    public ResponseCookie createlogoutcookie(String token){
        return ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .build();
    }
    public String extracttoken(HttpServletRequest request){
        if(request.getCookies() != null){
            for(Cookie cookie : request.getCookies()){
                if("token".equals(cookie.getName())){
                    return cookie.getValue();
                }
            }
        }
        return null;

    }

}
