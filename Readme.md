Simple Notes API

Hey there! Welcome to the Simple Notes API project.

This is a straightforward, secure, and modern backend service for creating and managing personal notes. It's built with FastAPI and uses MongoDB for the database, so it's fast, asynchronous, and flexible. It's a great little project to see how modern Python web frameworks, NoSQL databases, and token-based authentication all fit together.

What Can It Do? ✨
User Authentication: Secure signup and login using JWT (JSON Web Tokens). You can't see someone else's notes!

Full CRUD for Notes: You can Create, Read, Update, and Delete your notes.

Optimistic Concurrency Control: A neat little feature to prevent you from accidentally overwriting a note if you have it open in two different windows. If the note has been changed since you last fetched it, the API will let you know.

Fully Asynchronous: Built from the ground up with async and await for high performance.

Interactive Docs: Comes with beautiful, interactive API documentation powered by Swagger UI.

Getting It Running 🚀
Alright, let's get this thing set up on your machine. It's pretty simple.

1. Prerequisites
Make sure you have these installed on your system:

Python 3.10+

A MongoDB instance (You can use a free MongoDB Atlas cluster in the cloud or run it locally with Docker).

2. Get the Code & Set Up the Environment
First, grab the code and hop into the project directory. Then, you'll want to create a virtual environment. It's like a clean, private workspace for this project's packages so they don't mess with your other Python projects.

# Clone the repository (or just download the files)

cd your-project-folder

# Create a virtual environment
python -m venv .venv

# Activate it
# On Windows (PowerShell):
.venv\Scripts\Activate.ps1
# On macOS/Linux:
source .venv/bin/activate

3. Install the Goodies
Once your virtual environment is active, you can install all the necessary Python packages with one command.

pip install -r requirements.txt

4. Configure Your Secrets
This is the most important step! The application needs to know how to connect to your database and needs a secret key for security.

Find the file named .env.example and rename it to .env.

Open the new .env file and fill in the details:

# .env

# Paste your MongoDB connection string here.
# This could be from Atlas or your local instance.
MONGODB_URL=mongodb+srv://<user>:<password>@yourcluster.mongodb.net/your_db_name?retryWrites=true&w=majority

# This is for creating the JWT tokens. Make it long and random!
SECRET_KEY=a_super_long_and_very_secret_random_string_nobody_can_guess

# These can usually be left as they are
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

5. Run the Server!
You're all set. Time to fire it up.

uvicorn app.main:app --reload

The --reload flag is handy for development; it automatically restarts the server whenever you change a file.

You should see a message saying Application startup complete. Your API is now running on http://localhost:8000.

How to Use the API 🎮
The easiest way to play around with the API is to use the interactive documentation.

Open your browser and go to -> http://localhost:8000/docs

You'll see a full list of all the available endpoints. You can click on any of them, fill in parameters, and even execute requests directly from the page. It will handle the authentication flow for you!

A quick workflow:

Use the /auth/signup endpoint to create a new user.

Use the /auth/login endpoint with those same credentials to get an access_token.

Click the "Authorize" button at the top right and paste your token in (e.g., Bearer your_long_token_here).

Now you can use all the /notes endpoints to manage your notes!

Hope this helps you get started. Feel free to poke around the code, change things, and make it your own. Happy coding!