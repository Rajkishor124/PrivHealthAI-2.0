package com.privhealthai.review;

import com.privhealthai.appointment.AppointmentRepository;
import com.privhealthai.doctor.repository.DoctorRepository;
import com.privhealthai.exception.ApiException;
import com.privhealthai.exception.ResourceNotFoundException;
import com.privhealthai.review.dto.DoctorReviewsResponse;
import com.privhealthai.review.dto.ReviewRequest;
import com.privhealthai.review.dto.ReviewResponse;
import com.privhealthai.user.entity.UserEntity;
import com.privhealthai.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private static final String STATUS_CANCELLED = "CANCELLED";

    private final ReviewRepository reviewRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public DoctorReviewsResponse getDoctorReviews(UUID doctorId, UUID requesterId) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor", "id", doctorId);
        }

        List<ReviewEntity> reviews = reviewRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId);

        Map<UUID, String> names = reviews.isEmpty() ? Map.of()
                : userRepository.findAllById(reviews.stream().map(ReviewEntity::getUserId).distinct().toList())
                    .stream().collect(Collectors.toMap(UserEntity::getId, UserEntity::getName));

        List<ReviewResponse> mapped = reviews.stream()
                .map(r -> toResponse(r, names.getOrDefault(r.getUserId(), "Anonymous"), requesterId))
                .toList();

        ReviewResponse myReview = mapped.stream().filter(ReviewResponse::isMine).findFirst().orElse(null);

        Double avg = reviewRepository.averageRatingForDoctor(doctorId);
        boolean canReview = requesterId != null
                && appointmentRepository.existsByUserIdAndDoctorIdAndStatusNot(requesterId, doctorId, STATUS_CANCELLED);

        return DoctorReviewsResponse.builder()
                .averageRating(avg == null ? 0.0 : Math.round(avg * 10) / 10.0)
                .reviewCount(reviews.size())
                .canReview(canReview)
                .myReview(myReview)
                .reviews(mapped)
                .build();
    }

    @Transactional
    public ReviewResponse submitReview(UUID doctorId, ReviewRequest request, UUID userId) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor", "id", doctorId);
        }
        boolean hasBooked = appointmentRepository
                .existsByUserIdAndDoctorIdAndStatusNot(userId, doctorId, STATUS_CANCELLED);
        if (!hasBooked) {
            throw new ApiException("You can review a doctor only after booking an appointment with them",
                    HttpStatus.FORBIDDEN);
        }

        ReviewEntity entity = reviewRepository.findByUserIdAndDoctorId(userId, doctorId)
                .orElseGet(() -> ReviewEntity.builder().userId(userId).doctorId(doctorId).build());
        entity.setRating(request.getRating());
        entity.setComment(request.getComment());
        entity = reviewRepository.save(entity);

        String name = userRepository.findById(userId).map(UserEntity::getName).orElse("You");
        return toResponse(entity, name, userId);
    }

    @Transactional
    public void deleteReview(UUID reviewId, UUID userId) {
        ReviewEntity entity = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));
        if (!entity.getUserId().equals(userId)) {
            throw new ApiException("You can only delete your own review", HttpStatus.FORBIDDEN);
        }
        reviewRepository.delete(entity);
    }

    private ReviewResponse toResponse(ReviewEntity r, String userName, UUID requesterId) {
        return ReviewResponse.builder()
                .id(r.getId())
                .userName(userName)
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .mine(requesterId != null && requesterId.equals(r.getUserId()))
                .build();
    }
}
