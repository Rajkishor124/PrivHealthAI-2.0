package com.privhealthai.favorite.dto;

/** Result of toggling / querying a favorite, so the UI can render the correct heart state. */
public record FavoriteToggleResponse(boolean favorited) {}
