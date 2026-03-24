INSERT INTO users (id, name, email, password, created_at)
VALUES
    (1, 'Alice Kim', 'alice@example.com', 'password123', TIMESTAMP '2026-03-22 09:00:00'),
    (2, 'Bob Lee', 'bob@example.com', 'password123', TIMESTAMP '2026-03-22 09:05:00'),
    (3, 'Charlie Park', 'charlie@example.com', 'password123', TIMESTAMP '2026-03-22 09:10:00');

ALTER TABLE users ALTER COLUMN id RESTART WITH 4;

INSERT INTO tasks (id, title, description, status, due_at, creator_id, assignee_id, created_at, updated_at, completed_at)
VALUES
    (1, 'Plan Phase 2 API', 'Define the quick-add request and response DTOs', 'TODO', DATEADD('HOUR', 14, CURRENT_DATE), 1, NULL, DATEADD('HOUR', 9, CURRENT_DATE), DATEADD('HOUR', 9, CURRENT_DATE), NULL),
    (2, 'Review shared workflow', 'Prepare the collaboration flow for later phases', 'TODO', DATEADD('DAY', 2, DATEADD('HOUR', 10, CURRENT_DATE)), 1, 2, DATEADD('HOUR', 9, CURRENT_DATE), DATEADD('HOUR', 9, CURRENT_DATE), NULL),
    (3, 'Archive old MVP notes', 'Wrap up outdated planning notes', 'DONE', DATEADD('DAY', -1, DATEADD('HOUR', 15, CURRENT_DATE)), 1, NULL, DATEADD('DAY', -1, DATEADD('HOUR', 11, CURRENT_DATE)), DATEADD('DAY', -1, DATEADD('HOUR', 18, CURRENT_DATE)), DATEADD('DAY', -1, DATEADD('HOUR', 18, CURRENT_DATE))),
    (4, 'Write Bob onboarding draft', 'Initial checklist for Bob', 'TODO', NULL, 2, NULL, DATEADD('HOUR', 10, CURRENT_DATE), DATEADD('HOUR', 10, CURRENT_DATE), NULL);

ALTER TABLE tasks ALTER COLUMN id RESTART WITH 5;

INSERT INTO task_shares (id, task_id, user_id, created_at)
VALUES
    (1, 2, 3, DATEADD('HOUR', 12, CURRENT_DATE)),
    (2, 4, 1, DATEADD('HOUR', 12, CURRENT_DATE));

ALTER TABLE task_shares ALTER COLUMN id RESTART WITH 3;

INSERT INTO task_comments (id, task_id, author_id, content, created_at)
VALUES
    (1, 2, 1, 'We should keep the collaboration flow simple for MVP.', DATEADD('HOUR', 13, CURRENT_DATE)),
    (2, 2, 2, 'I can take the assignee perspective once the UI is ready.', DATEADD('HOUR', 14, CURRENT_DATE)),
    (3, 4, 2, 'Draft first, then share with Alice for review.', DATEADD('HOUR', 15, CURRENT_DATE));

ALTER TABLE task_comments ALTER COLUMN id RESTART WITH 4;

INSERT INTO notifications (id, recipient_id, task_id, type, message, read, created_at)
VALUES
    (1, 1, 4, 'SHARED', 'Bob Lee shared "Write Bob onboarding draft" with you', FALSE, DATEADD('HOUR', 16, CURRENT_DATE)),
    (2, 2, 2, 'ASSIGNED', 'Alice Kim assigned you to "Review shared workflow"', TRUE, DATEADD('HOUR', 17, CURRENT_DATE)),
    (3, 3, 2, 'COMMENTED', 'Alice Kim commented on "Review shared workflow"', FALSE, DATEADD('HOUR', 18, CURRENT_DATE));

ALTER TABLE notifications ALTER COLUMN id RESTART WITH 4;
