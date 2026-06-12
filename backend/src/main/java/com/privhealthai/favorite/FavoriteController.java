package com.privhealthai.favorite;

import com.privhealthai.common.ApiResponse;
import com.privhealthai.doctor.dto.DoctorDto;
import com.privhealthai.favorite.dto.FavoriteToggleResponse;
import com.privhealthai.user.entity.UserEntity;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@Tag(name = "Favorites")
@SecurityRequirement(name = "bearerAuth")
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DoctorDto>>> myFavorites(
            @AuthenticationPrincipal UserDetails userDetails) {
        UserEntity user = (UserEntity) userDetails;
        return ResponseEntity.ok(ApiResponse.success(favoriteService.listForUser(user.getId())));
    }

    @GetMapping("/{doctorId}")
    public ResponseEntity<ApiResponse<FavoriteToggleResponse>> status(
            @PathVariable UUID doctorId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UserEntity user = (UserEntity) userDetails;
        return ResponseEntity.ok(ApiResponse.success(
                new FavoriteToggleResponse(favoriteService.isFavorited(user.getId(), doctorId))));
    }

    @PostMapping("/{doctorId}/toggle")
    public ResponseEntity<ApiResponse<FavoriteToggleResponse>> toggle(
            @PathVariable UUID doctorId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UserEntity user = (UserEntity) userDetails;
        return ResponseEntity.ok(ApiResponse.success(favoriteService.toggle(user.getId(), doctorId)));
    }
}
