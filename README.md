# URL-SHORTENER

A simple url shortener built using Express.js, MongoDB, Redis and Bull.

# Requirements

* MongoDB
* Node.js
* Redis

## Setup

* Run `npm install`.
* Start MongoDB service.
* Start Redis server.
* Duplicate `env.example` to a `.env` and fill in correct fields.
* Run `npm run start`.

## Routes

### `GET /`

Renders the home page of the url shortener.

#### Error Messages

* `Internal Server Error` - An internal server error occured.

## Routes

### `POST /shorten`

Shortens a given url.

#### Request Body

* `fullUrl`: The full url to be shortened.

**Example**
```bash
curl -X POST -H "Content-Type: application/json" -d '{"fullUrl": "http://www.victornnamdii.com"}' http://127.0.0.1:5000/shorten

# Returns {"message": "URL Shortened successfully to x"} if successfully created, where x is the path for the new url. Status code: 201

# Returns {"error": "error_message"} if there was an error during the request. Status code: 400 || 500
```

#### Error Messages

* `Please enter a link` - User didn't enter a link.
* `Please enter a valid URL. It should start with either 'https://', 'http://' or 'ftp://'` - User entered an invalid link.
* `Internal Server Error` - An internal server error occured.

### `GET /:shortUrl`

Redirects the user to the full url that was shortened.

**Example**
```bash
curl http://127.0.0.1:5000/xsdwwer

# Redirects to the shortened url on a succesful request.

# Returns {"error": "error_message"} if there was an error during the request. Status code: 404 || 500
```

#### Error Messages

* `Page not found` - The short url parameter does is not related to any full url in the database.
* `Internal Server Error` - An internal server error occured.
