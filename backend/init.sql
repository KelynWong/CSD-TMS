-- Delete all existing data before inserting new data
-- user_ms
DELETE FROM "user"."rating";
DELETE FROM "user"."user";

-- match_ms
DELETE FROM "match"."game";
DELETE FROM "match"."match";

-- tournament_ms
DELETE FROM "tournament"."tournament_player";
DELETE FROM "tournament"."tournament";
DELETE FROM "tournament"."player";

-- Insert data
-- user_ms
INSERT INTO "user"."user" ("id", "country", "email", "fullname", "gender", "profile_picture", "role", "username") VALUES ('user1', 'USA', 'jdoe@example.com', 'John Doe', 'Male', null, 'PLAYER', 'jdoe'), ('user10', 'Japan', 'rfujiwara@example.com', 'Rika Fujiwara', 'Female', null, 'PLAYER', 'rfujiwara'), ('user11', 'Australia', 'psmith@example.com', 'Paul Smith', 'Male', null, 'PLAYER', 'psmith'), ('user12', 'Mexico', 'ngarcia@example.com', 'Nina Garcia', 'Female', null, 'PLAYER', 'ngarcia'), ('user13', 'Argentina', 'mrodriguez@example.com', 'Manuel Rodriguez', 'Male', null, 'PLAYER', 'mrodriguez'), ('user14', 'Canada', 'sjohnson@example.com', 'Samantha Johnson', 'Female', null, 'PLAYER', 'sjohnson'), ('user15', 'Egypt', 'mhassan@example.com', 'Mohammed Hassan', 'Male', null, 'PLAYER', 'mhassan'), ('user16', 'Colombia', 'ahernandez@example.com', 'Alicia Hernandez', 'Female', null, 'PLAYER', 'ahernandez'), ('user17', 'South Korea', 'jpark@example.com', 'Jin Park', 'Male', null, 'PLAYER', 'jpark'), ('user18', 'Taiwan', 'lchang@example.com', 'Ling Chang', 'Female', null, 'PLAYER', 'lchang'), ('user19', 'Germany', 'cfischer@example.com', 'Christian Fischer', 'Male', null, 'PLAYER', 'cfischer'), ('user2', 'Spain', 'amartinez@example.com', 'Anna Martinez', 'Female', null, 'PLAYER', 'amartinez'), ('user20', 'China', 'yao@example.com', 'Yao Ming', 'Male', null, 'PLAYER', 'yao'), ('user_2ngKh5qJhhqqmuaq3zLNM5Oh0Vo', 'Singapore', 'kelynwonget@gmail.com', 'Kelyn Wong', 'female', 'https://www.gravatar.com/avatar?d=mp', 'ADMIN', 'kelynwong123'), ('user3', 'China', 'lwang@example.com', 'Li Wang', 'Male', null, 'PLAYER', 'lwang'), ('user4', 'India', 'skumar@example.com', 'Suresh Kumar', 'Male', null, 'PLAYER', 'skumar'), ('user5', 'UK', 'mthompson@example.com', 'Maria Thompson', 'Female', null, 'PLAYER', 'mthompson'), ('user6', 'Denmark', 'hjensen@example.com', 'Hannah Jensen', 'Female', null, 'PLAYER', 'hjensen'), ('user7', 'South Korea', 'tlee@example.com', 'Tom Lee', 'Male', null, 'PLAYER', 'tlee'), ('user8', 'Russia', 'kpetrov@example.com', 'Katerina Petrov', 'Female', null, 'PLAYER', 'kpetrov'), ('user9', 'Vietnam', 'znguyen@example.com', 'Zhang Nguyen', 'Male', null, 'PLAYER', 'znguyen');
INSERT INTO "user"."rating" ("user_id", "last_rating_period_end_date", "number_of_results", "rating", "rating_deviation", "volatility") VALUES ('user1', '2024-10-23 09:17:32.475257', '1', '1336.90902392151', '291.347098234971', '0.0599992719153955'), ('user10', '2024-10-23 09:20:50.909873', '4', '1811.16241948108', '193.001540883831', '0.0599967483480784'), ('user11', '2024-10-23 09:19:53.455115', '2', '1532.8537275629', '248.265475055396', '0.0599984556282367'), ('user12', '2024-10-23 09:18:24.703404', '1', '1336.90902392151', '291.347098234971', '0.0599992719153955'), ('user13', '2024-01-01 00:00:00', '0', '1500', '350', '0.06'), ('user14', '2024-10-23 09:20:37.774166', '3', '1687.17098472262', '216.708770029415', '0.0599976014799891'), ('user15', '2024-01-01 00:00:00', '0', '1500', '350', '0.06'), ('user16', '2024-10-23 09:20:05.1702', '2', '1532.85372915373', '248.265473343822', '0.0599984556282395'), ('user17', '2024-01-01 00:00:00', '0', '1500', '350', '0.06'), ('user18', '2024-10-23 09:18:52.114116', '1', '1336.90902392151', '291.347098234971', '0.0599992719153955'), ('user19', '2024-01-01 00:00:00', '0', '1500', '350', '0.06'), ('user2', '2024-10-23 09:18:07.04005', '1', '1336.90902392151', '291.347098234971', '0.0599992719153955'), ('user20', '2024-10-23 09:20:24.21338', '3', '1687.1709852721', '216.708772699472', '0.0599976014799921'), ('user3', '2024-10-23 09:17:16.878115', '1', '1336.90902392151', '291.347098234971', '0.0599992719153955'), ('user4', '2024-10-23 09:19:24.31256', '2', '1532.85372510819', '248.265478211914', '0.0599984556282412'), ('user5', '2024-10-23 09:19:04.895279', '1', '1336.90902392151', '291.347098234971', '0.0599992719153955'), ('user6', '2024-10-23 09:20:50.909873', '4', '1987.80851486436', '193.001544794892', '0.0599967483480162'), ('user7', '2024-10-23 09:19:37.114615', '2', '1532.85372709621', '248.265476078761', '0.0599984556282449'), ('user8', '2024-10-23 09:18:36.74756', '1', '1336.90902392151', '291.347098234971', '0.0599992719153955'), ('user9', '2024-10-23 09:17:51.22697', '1', '1336.90902392151', '291.347098234971', '0.0599992719153955');

-- match_ms
INSERT INTO
    "match"."match" (
    "id",
    "player1id",
    "player2id",
    "round_num",
    "tournament_id",
    "winner_id",
    "left_id",
    "right_id"
)
VALUES
    (
        '434',
        'user4',
        'user3',
        '16',
        '1',
        'user4',
        null,
        null
    ),
    (
        '435',
        'user1',
        'user6',
        '16',
        '1',
        'user6',
        null,
        null
    ),
    (
        '436',
        'user20',
        'user9',
        '16',
        '1',
        'user20',
        null,
        null
    ),
    (
        '437',
        'user7',
        'user2',
        '16',
        '1',
        'user7',
        null,
        null
    ),
    (
        '438',
        'user11',
        'user12',
        '16',
        '1',
        'user11',
        null,
        null
    ),
    (
        '439',
        'user8',
        'user14',
        '16',
        '1',
        'user14',
        null,
        null
    ),
    (
        '440',
        'user10',
        'user18',
        '16',
        '1',
        'user10',
        null,
        null
    ),
    (
        '441',
        'user16',
        'user5',
        '16',
        '1',
        'user16',
        null,
        null
    ),
    (
        '442',
        'user4',
        'user6',
        '8',
        '1',
        'user6',
        '434',
        '435'
    ),
    (
        '443',
        'user20',
        'user7',
        '8',
        '1',
        'user20',
        '436',
        '437'
    ),
    (
        '444',
        'user11',
        'user14',
        '8',
        '1',
        'user14',
        '438',
        '439'
    ),
    (
        '445',
        'user10',
        'user16',
        '8',
        '1',
        'user10',
        '440',
        '441'
    ),
    (
        '446',
        'user6',
        'user20',
        '4',
        '1',
        'user6',
        '442',
        '443'
    ),
    (
        '447',
        'user14',
        'user10',
        '4',
        '1',
        'user10',
        '444',
        '445'
    ),
    (
        '448',
        'user6',
        'user10',
        '2',
        '1',
        'user6',
        '446',
        '447'
    );

INSERT INTO
    "match"."game" (
    "id",
    "player1score",
    "player2score",
    "set_num",
    "match_id"
)
VALUES
    ('180', '21', '18', '1', '434'),
    ('181', '21', '16', '2', '434'),
    ('182', '18', '21', '1', '435'),
    ('183', '15', '21', '2', '435'),
    ('184', '18', '21', '1', '436'),
    ('185', '21', '16', '2', '436'),
    ('186', '21', '18', '3', '436'),
    ('187', '21', '15', '1', '437'),
    ('188', '21', '10', '2', '437'),
    ('189', '21', '18', '1', '438'),
    ('190', '21', '16', '2', '438'),
    ('191', '18', '21', '1', '439'),
    ('192', '10', '21', '2', '439'),
    ('193', '18', '21', '1', '440'),
    ('194', '21', '18', '2', '440'),
    ('195', '21', '10', '3', '440'),
    ('196', '21', '10', '1', '441'),
    ('197', '21', '6', '2', '441'),
    ('198', '19', '21', '1', '442'),
    ('199', '17', '21', '2', '442'),
    ('200', '21', '19', '1', '443'),
    ('201', '21', '16', '2', '443'),
    ('202', '18', '21', '1', '444'),
    ('203', '15', '21', '2', '444'),
    ('204', '21', '18', '1', '445'),
    ('205', '21', '19', '2', '445'),
    ('206', '12', '21', '1', '446'),
    ('207', '21', '18', '2', '446'),
    ('208', '21', '17', '3', '446'),
    ('209', '18', '21', '1', '447'),
    ('210', '14', '21', '2', '447'),
    ('211', '21', '19', '1', '448'),
    ('212', '21', '10', '2', '448');
-- tournament_ms
INSERT INTO "tournament"."tournament" ("id", "created_by", "enddt", "reg_enddt", "reg_startdt", "startdt", "status", "tournament_name", "winner") VALUES ('1', 'user_2ngKh5qJhhqqmuaq3zLNM5Oh0Vo', '2024-11-06 10:00:00', '2024-10-30 15:59:00', '2024-10-23 16:00:00', '2024-11-02 01:00:00', 'ONGOING', 'Tournament 1', null), ('2', 'user_2ngKh5qJhhqqmuaq3zLNM5Oh0Vo', '2024-11-22 01:00:00', '2024-11-06 15:00:00', '2024-10-30 01:00:00', '2024-11-11 04:00:00', 'SCHEDULED', 'Tournament 2', null);
INSERT INTO "tournament"."player" ("id") VALUES ('user1'), ('user10'), ('user11'), ('user12'), ('user14'), ('user16'), ('user18'), ('user2'), ('user20'), ('user3'), ('user4'), ('user5'), ('user6'), ('user7'), ('user8'), ('user9');
INSERT INTO "tournament"."tournament_player" ("player_id", "tournament_id") VALUES ('user1', '2'), ('user1', '1'), ('user10', '1'), ('user11', '1'), ('user12', '1'), ('user14', '1'), ('user16', '1'), ('user18', '1'), ('user2', '2'), ('user2', '1'), ('user20', '1'), ('user3', '1'), ('user3', '2'), ('user4', '2'), ('user4', '1'), ('user5', '2'), ('user5', '1'), ('user6', '1'), ('user6', '2'), ('user7', '2'), ('user7', '1'), ('user8', '1'), ('user9', '1');
