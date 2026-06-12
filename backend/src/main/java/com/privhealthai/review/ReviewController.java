package com.privhealthai.review;

import com.privhealthai.common.ApiResponse;
import com.privhealthai.review.dto.DoctorReviewsResponse;
import com.privhealthai.review.dto.ReviewRequest;
import com.privhealthai.review.dto.ReviewResponse;
import com.privhealthai.user.entity.UserEntity;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Reviews")
public class ReviewController {

    private final ReviewService reviewService;

    /** Public: list reviews + rating summary for a doctor (canReview/myReview filled when authenticated). */
    @GetMapping("/doctors/{doctorId}/reviews")
    public ResponseEntity<ApiResponse<DoctorReviewsResponse>> getReviews(
            @PathVariable UUID doctorId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = userDetails instanceof UserEntity u ? u.getId() : null;
        return ResponseEntity.ok(ApiResponse.success(reviewService.getDoctorReviews(doctorId, userId)));
    }

    /** Authenticated: create or update the caller's review for a doctor. */
    @PostMapping("/doctors/{doctorId}/reviews")
    public ResponseEntity<ApiResponse<ReviewResponse>> submitReview(
            @PathVariable UUID doctorId,
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        UserEntity user = (UserEntity) userDetails;
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(reviewService.submitReview(doctorId, request, user.getId())));
    }

    /** Authenticated: delete the caller's own review. */
    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @PathVariable UUID reviewId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UserEntity user = (UserEntity) userDetails;
        reviewService.deleteReview(reviewId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
