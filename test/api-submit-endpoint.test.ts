
jest.mock('astro:content', () => ({
  z: require('zod').z,
  defineCollection: jest.fn(),
}), { virtual: true });
jest.mock('astro/loaders', () => ({
  glob: jest.fn(),
}), { virtual: true });
process.env.ADMIN_PASSWORD = 'test_password_123';

import { describe, it, expect, beforeAll, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import app from '../server';
import fsPromises from 'fs/promises';
import { updateCsv } from '../src/utils/article-submission';

jest.mock('fs/promises', () => ({
  access: jest.fn(),
  writeFile: jest.fn(),
  appendFile: jest.fn(),
}));

jest.mock('../src/utils/article-submission', () => {
  const actual = jest.requireActual('../src/utils/article-submission') as Record<string, unknown>;
  return {
    ...actual,
    updateCsv: jest.fn(),
  };
});

describe('POST /api/articles/submit', () => {
  const validPayload = {
    title: 'Test Article Title',
    dateline_location: 'Test City',
    in_universe_date: 'Test Date',
    timeline_flair: 'On Earth',
    source_work: 'Test Work',
    source_medium: 'Book',
    source_creator: 'Test Author',
    release_year: 2023,
    context_note: 'Test note',
    external_links: [{ name: 'Test Link', url: 'https://example.com' }],
  };

  let token: string;

  beforeAll(async () => {
    // Authenticate and get a valid token
    const res = await request(app)
      .post('/api/admin/verify')
      .send({ password: 'test_password_123' });

    token = res.body.token;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should reject requests without authorization header', async () => {
    const res = await request(app)
      .post('/api/articles/submit')
      .send(validPayload);
    expect(res.status).toBe(401);
  });

  it('should reject invalid payloads', async () => {
    const invalidPayload = { ...validPayload };
    delete (invalidPayload as { title?: string }).title; // Remove required field

    const res = await request(app)
      .post('/api/articles/submit')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidPayload);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('should return 409 if article slug already exists', async () => {
    // Mock access to succeed (meaning file exists)
    (fsPromises.access as jest.Mock<() => Promise<void>>).mockResolvedValueOnce(undefined);

    const res = await request(app)
      .post('/api/articles/submit')
      .set('Authorization', `Bearer ${token}`)
      .send(validPayload);

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('Article with this title already exists');
  });

  it('should return 201 and update files on valid submission', async () => {
    // Mock access to fail (meaning file does not exist)
    (fsPromises.access as jest.Mock<() => Promise<void>>).mockRejectedValueOnce(new Error('ENOENT'));
    (fsPromises.writeFile as jest.Mock<() => Promise<void>>).mockResolvedValueOnce(undefined);

    const res = await request(app)
      .post('/api/articles/submit')
      .set('Authorization', `Bearer ${token}`)
      .send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.slug).toBe('test-article-title');
    expect(res.body.previewUrl).toBe('/archive/test-article-title');

    expect(fsPromises.writeFile).toHaveBeenCalled();
    expect(updateCsv).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Test Article Title' }),
      expect.any(String)
    );
  });
});
