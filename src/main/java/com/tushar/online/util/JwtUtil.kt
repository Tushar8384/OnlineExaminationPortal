package com.tushar.online.util

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import java.security.Key
import java.util.*
import java.util.function.Function

@Component
class JwtUtil {
    fun extractUsername(token: String?): String {
        return extractClaim<String?>(token, Function { obj: Claims? -> obj!!.subject })!!
    }

    fun <T> extractClaim(token: String?, claimsResolver: Function<Claims?, T?>): T? {
        val claims = extractAllClaims(token)
        return claimsResolver.apply(claims)
    }

    private fun extractAllClaims(token: String?): Claims? {
        return Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token).getBody()
    }

    fun generateToken(userDetails: UserDetails): String? {
        val claims: MutableMap<String?, Any?> = HashMap<String?, Any?>()
        // You can add roles here if needed
        return createToken(claims, userDetails.username)
    }

    private fun createToken(claims: MutableMap<String?, Any?>?, subject: String?): String? {
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(subject)
            .setIssuedAt(Date(System.currentTimeMillis()))
            .setExpiration(Date(System.currentTimeMillis() + EXPIRATION_TIME))
            .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
            .compact()
    }

    fun validateToken(token: String?, userDetails: UserDetails): Boolean {
        val username = extractUsername(token)
        return (username == userDetails.username && !isTokenExpired(token))
    }

    private fun isTokenExpired(token: String?): Boolean {
        return extractClaim<Date?>(token, Function { obj: Claims? -> obj!!.expiration })!!.before(Date())
    }

    companion object {
        // Use a secure key (min 256 bits)
        private val SECRET_KEY: Key? = Keys.secretKeyFor(SignatureAlgorithm.HS256)
        private const val EXPIRATION_TIME = (1000 * 60 * 60 * 10 // 10 hours
                ).toLong()
    }
}