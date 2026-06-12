package com.privhealthai.assessment;

import com.privhealthai.assessment.dto.AssessmentRequest;
import com.privhealthai.assessment.dto.AssessmentResponse;
import com.privhealthai.common.ApiResponse;
import com.privhealthai.user.entity.UserEntity;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assessment")
@RequiredArgsConstructor
@Tag(name = "Assessment")
@SecurityRequirement(name = "bearerAuth")
public class AssessmentController {

    private final AssessmentService assessmentService;

    @PostMapping
    public ResponseEntity<ApiResponse<AssessmentResponse>> submit(
            @Valid @RequestBody AssessmentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        UserEntity user = (UserEntity) userDetails;
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(assessmentService.submit(request, user.getId())));
    }
}
