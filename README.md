# Art Gallery API Documentation

This API allows access to a curated collection of paintings and their associated comments. 

Users can:
- retrieve all paintings
- retrieve a specific painting by its ID
- retrieve all comments for a specific painting
- post comments for a specific painting 

Comments are related to paintings in the sense many comments correspond to one painting, based on its ID. All painting images are from wikimedia.

**Base URL**: http://localhost:3000/api

## Authentication
The API does not require any authentication.

## Paintings

### Get All Paintings
Retrieves list of all paintings, each with id, title, artist, and image.

**Endpoint**: GET /api/paintings

**Response**:
[{
    "id": 1,
    "title": "Impression Sunrise",
    "artist": "Claude Monet",
    "imageURL": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Monet_-_Impression%2C_Sunrise.jpg/1546px-Monet_-_Impression%2C_Sunrise.jpg?20131023155032"
},
{
    "id": 2,
    "title": "Woman at Her Toilette",
    "artist": "Berthe Morisot",
    "imageURL": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Berthe_Morisot_-_Woman_at_Her_Toilette_-_1924.127_-_Art_Institute_of_Chicago.jpg/1600px-Berthe_Morisot_-_Woman_at_Her_Toilette_-_1924.127_-_Art_Institute_of_Chicago.jpg?20181103020102",
},
{
    "id": 3,
    "title": "Springtime",
    "artist": "Claude Monet",
    "imageURL": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Claude_Monet_-_Springtime_-_Google_Art_Project.jpg/1568px-Claude_Monet_-_Springtime_-_Google_Art_Project.jpg?20130105135222",
},
{
    "id": 4,
    "title": "Carnation, Lily, Lily, Rose",
    "artist": "John Singer Sargent",
    "imageURL": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/John_Singer_Sargent_-_Carnation%2C_Lily%2C_Lily%2C_Rose_-_Google_Art_Project.jpg/1062px-John_Singer_Sargent_-_Carnation%2C_Lily%2C_Lily%2C_Rose_-_Google_Art_Project.jpg?20110220012731"
},
{
    "id": 5,
    "title": "Woman with a Parasol",
    "artist": "Claude Monet",
    "imageURL": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Claude_Monet_-_Woman_with_a_Parasol_-_Madame_Monet_and_Her_Son_-_Google_Art_Project.jpg/964px-Claude_Monet_-_Woman_with_a_Parasol_-_Madame_Monet_and_Her_Son_-_Google_Art_Project.jpg?20121018210124"
},
{
    "id": 6,
    "title": "Young Girls in a Row Boat",
    "artist": "Claude Monet",
    "imageURL": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Young_Girls_in_a_Rowing_Boat_%281887%29_Claude_Monet_-_The_National_Museum_of_Western_Art%2C_Tokyo_%28W1152%29.jpg?20240203135139"
}]

**Status Codes:** 
200 OK: success

### Get Specific Painting by ID
Retrieves individual painting and more detailed information about it, including title, artist, artist's info (nationality and birth/death years), year created, medium, dimensions, and image.

**Endpoint:** GET /api/painting/{id}

**Example:** GET /api/painting/1
**Example Response:**
    "id": 1,
    "title": "Impression Sunrise",
    "artist": "Claude Monet",
    "artistInfo": "French, 1840-1926",
    "year": 1872,
    "medium": "Oil on Canvas",
    "dimensions": "48 x 63 cm",
    "imageURL": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Monet_-_Impression%2C_Sunrise.jpg/1546px-Monet_-_Impression%2C_Sunrise.jpg?20131023155032"

**Status Codes:**
200 OK: success
404 Not Found: painting not found

## Comments

### Get All Comments for Specific Painting
Retrieves all comments associated to specific painting. Comments in form of name of commentor and their comment text.

**Endpoint:** GET /api/comments/{paintingId}

**Example:** GET /api/comments/1
**Example Response:**
[{"name": "Abbey", "text": "My favorite Impressionist painting ever."},{"name": "Pavel","text": "Hrmmm... Splendid...."}]

### Post a Comment
User can add a new comment to a specific painting. Empty comments are not accepted. If a user doesn't enter their name, it is assumed as "Anonymous".

**Endpoint:** POST /api/comments/{paintingId}

**Example Request:**
POST /api/comments 1
{"name": "Jasmine", "text": "The colour is the best part of this painting."}

**Status Codes:**
200 OK - success
400 Bad Request - empty comment text

## Errors
Errors return JSON object with error message.

**Example:** "error": "Painting not found"

**Status Codes Used:**
- 200 OK: success
- 400 Bad Request: missing fields
- 404 Not Found: non-existent

## Run Server
Install the dependencies: npm install.
Start the server using npm start (node server.js).
Run tests with npm test.

## Use API
Use curl. Hosted on port 3000.

**Fetch all paintings:**
curl -X GET http://localhost:3000/api/paintings

**Fetch specific painting:**
curl -X GET http://localhost:3000/api/painting/1

**Fetch comments for painting:**
curl -X GET http://localhost:3000/api/comments/1

**Add comment to painting:**
curl -X POST http://localhost:3000/api/comments/1 \
     -H "Content-Type: application/json" \
     -d '{"name": "Dave", "text": "Wowza!"}'


## Test API
Test API using Jest and Supertest.

**Test Cases:**
- GET /api/paintings, return 200, return JSON painting objects with title, name, image only
- GET /api/painting/1, return JSON painting object
- GET /api/painting/999, return 404
- GET /api/comments/1, return all comments for painting with ID 1
- POST /api/comments/1, return 200, adds comment successfully
- POST api/comments/1 with empty comment text, return 400
- POST api/comments/1 with empty name text, adds comment successfully with name Anonymous

## Notes
- API uses RESTful design
- Paintings are stored in a read only JSON file. They cannot be posted to.
- Comments stored persistently using a JSON file.
- Made by Abbey Noble
- Thanks for using c: