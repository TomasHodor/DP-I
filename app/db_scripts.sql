DROP TABLE IF EXISTS "contribution";
DROP TABLE IF EXISTS "campaign";
DROP TABLE IF EXISTS "user" ;


CREATE TABLE "user" (
    user_id serial PRIMARY KEY,
    email VARCHAR (255) NOT NULL,
    password  VARCHAR (255) NOT NULL,
    name VARCHAR (255),
    surname VARCHAR (255),
    phone VARCHAR (255)
);

CREATE TABLE "campaign" (
    campaign_id serial PRIMARY KEY,
    address VARCHAR (255),
    description TEXT,
    owner INTEGER REFERENCES "user"(user_id)
);

CREATE TABLE "contribution" (
    contribution_id serial PRIMARY KEY,
    hash VARCHAR (255),
    contributor INTEGER REFERENCES "user"(user_id),
    campaign INTEGER REFERENCES "campaign"(campaign_id)
);