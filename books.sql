CREATE TABLE books (
id SERIAL PRIMARY KEY,
author VARCHAR(255),
title  VARCHAR(255),
isbn   NUMERIC(30, 7), 
image_url VARCHAR(255),
description VARCHAR(255),
bookshelf VARCHAR(255) 
);

-- //psql -d book_api -f books.sql