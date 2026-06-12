package com.privhealthai.review.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/** Everything the doctor-details page needs to render the reviews section in one call. */
@Data
@Builder
public class DoctorReviewsResponse {

    private double averageRating;
    private long reviewCount;
    /** True when the requesting user is eligible to leave/update a review (has booked this doctor). */
    private boolean canReview;
    /** The requesting user's existing review, if any (for prefilling the edit form). */
    private ReviewResponse myReview;
    private List<ReviewResponse> reviews;
}
