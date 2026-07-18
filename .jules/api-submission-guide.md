# API Submission Guide

## Endpoint: `POST /api/articles/submit`

Submits a new fictional history article to the archive. This endpoint automatically generates the Markdown file with the necessary YAML frontmatter and updates the database CSV.

### Authentication

Requires an Admin Bearer token. To get the token, authenticate with `POST /api/admin/verify`.
Requires a CSRF token for state-mutating requests (POST). First fetch the token from `GET /api/csrf-token`, which will return `{ "csrfToken": "..." }` and set a cookie. Include the token in subsequent requests using the `x-csrf-token` header, and ensure the cookie is also sent.

### Rate Limiting

Maximum 10 submissions per hour per IP.

### Request Body (JSON)

The payload must strictly conform to the expected Zod schema for article fields.

**Example Request:**

```json
{
  "title": "Rebel Alliance Destroys Imperial Superweapon in Galactic Triumph",
  "dateline_location": "Yavin 4 Orbit",
  "in_universe_date": "Late 0 BBY",
  "timeline_flair": "Not On Earth",
  "source_work": "Star Wars: Episode IV – A New Hope",
  "source_medium": "Film",
  "source_creator": "George Lucas",
  "release_year": 1977,
  "context_note": "This event marks the climax of the film, signifying the first major victory for the Rebel Alliance.",
  "image_url": "/images/death-star-explosion.jpg"
}
```

### Response

**Success (201 Created)**

```json
{
  "slug": "rebel-alliance-destroys-imperial-superweapon-in-galactic-triumph",
  "previewUrl": "/archive/rebel-alliance-destroys-imperial-superweapon-in-galactic-triumph"
}
```

**Validation Error (400 Bad Request)**

```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["title"],
      "message": "Required"
    }
  ]
}
```

**Conflict (409 Conflict)**

```json
{
  "error": "Article with this title already exists"
}
```

**Rate Limited (429 Too Many Requests)**

```json
{
  "error": "Rate limit exceeded. Maximum 10 submissions per hour."
}
```

### Usage Example (Fetch API)

```javascript
const csrfResponse = await fetch('/api/csrf-token');
const { csrfToken } = await csrfResponse.json();

const token = 'your_admin_session_token';
const response = await fetch('/api/articles/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'x-csrf-token': csrfToken,
  },
  body: JSON.stringify({
    title: 'Example Title',
    dateline_location: 'Example City',
    in_universe_date: '1999',
    timeline_flair: 'On Earth',
    source_work: 'Example Work',
    source_medium: 'Book',
    source_creator: 'Author',
    release_year: 2024,
    context_note: 'Some note.',
  }),
});
const data = await response.json();
```
