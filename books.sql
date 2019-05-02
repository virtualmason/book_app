CREATE TABLE books (
id SERIAL PRIMARY KEY,
author VARCHAR(255),
title  VARCHAR(255),
isbn   VARCHAR(255), 
image_url VARCHAR(255),
description VARCHAR,
bookshelf VARCHAR(255) 
);

-- //psql -d book_app -f books.sql