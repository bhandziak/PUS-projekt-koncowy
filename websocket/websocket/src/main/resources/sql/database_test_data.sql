



-- USERS

-- password: 12345
-- $2a$12$sDlIkYyL34rzFB78q.1Ls.ZAalBNn.oyrN1mIHMjqBee4ZTKNOp22


INSERT INTO users (id, username, password, role) VALUES
(gen_random_uuid(),'andrzej', '$2a$12$sDlIkYyL34rzFB78q.1Ls.ZAalBNn.oyrN1mIHMjqBee4ZTKNOp22', 'USER'),
(gen_random_uuid(),'jan', '$2a$12$sDlIkYyL34rzFB78q.1Ls.ZAalBNn.oyrN1mIHMjqBee4ZTKNOp22', 'ADMIN')
ON CONFLICT (username)
DO NOTHING;