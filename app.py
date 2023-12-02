from flask import Flask, redirect, render_template, request, session, jsonify
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from cs50 import SQL

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Configure session to use filesystem 
app.config["SECRET_KEY"] = "HELLOSLMAOOASDOK"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

db = SQL("sqlite:///scores.db")

@app.route("/")
def index():
    # Verify user is logged in
    if session.get("user_id") == None:
        return redirect("/login")
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    # Client attempting to login
    if request.method == "POST":

        username = request.form.get("username")
        password = request.form.get("password")

        # check user input
        if not username: 
            return render_template("apology.html")
        user = db.execute("SELECT * FROM users WHERE username = ?", username)

        # check user password and that it matches the password from the database
        if len(user) < 1 or not check_password_hash(user[0]['password'], password):
            return render_template("apology.html", message="password incorrect/user doesn't exist")

        # Set the session to the current user
        session['user_id'] = user[0]['id']
        session['username'] = user[0]['username']
        
        return redirect("/")
    return render_template("login.html")

@app.route("/logout", methods=["GET", "POST"])
def logout():

    # log the user out
    if request.method == "POST":
        session['user_id'] = None
        return redirect("/login")

    session['user_id'] = None
    return redirect("/login")

@app.route("/register", methods=["GET", "POST"])
def register():

    # Client created a new account
    if request.method == "POST":

        username = request.form.get("username")
        password = request.form.get("password")
        confirmation_password = request.form.get("confirmation")

        # Execute SQL for existing user
        existing_user = db.execute("SELECT * FROM users WHERE username = ?", username);
        
        # Check user input
        if not username or len(existing_user) > 0:
            return render_template("apology.html", message="Invalid Username/User already exists")

        # Check Password Input
        if not password or password != confirmation_password:
            return render_template("apology.html", message="Password and Confirmation not the same")

        # Add user to the data base
        new_user = db.execute("INSERT INTO users (username, password) VALUES (?, ?)", username, generate_password_hash(password))
    
        # Set the session to the current user
        session['user_id'] = new_user
        session['username'] = username

        return redirect("/")
    return render_template("register.html")


@app.route("/scores", methods=["GET", "POST"])
def scores():
    # Verify user is logged in
    if session.get("user_id") == None:
        return ('User not logged in', 401)
    
    # Client is adding a score to the database
    if request.method == "POST":    
        
        # Get score and accuracy from request content
        request_content = request.get_json()
        score = request_content['score']
        accuracy = request_content['accuracy']
        datasetIndex = request_content['datasetIndex']
        minutes = request_content['minutes']

        user_id = session['user_id']
        username = session['username']

        # Add score to the database
        db.execute("INSERT INTO scores (userID, score, accuracy, username, datasetIndex, minutes) VALUES (?, ?, ?, ?, ?, ?)", user_id, score, accuracy, username, datasetIndex, minutes)
        leaderboard_data = db.execute("SELECT score, accuracy, username FROM scores WHERE minutes = ? AND datasetIndex = ? ORDER BY score DESC LIMIT 15", minutes, datasetIndex)
    
        return jsonify(leaderboard_data)

    # Return the users score data
    data = db.execute("SELECT * FROM scores WHERE userID = ?", session['user_id'])
    return jsonify(data)     


@app.route("/deletescores", methods=["POST"])
def deletescores():
    # Verify user is logged in
    if session.get("user_id") == None:
        return ('User not logged in', 401)
    
    db.execute("DELETE FROM scores WHERE userId = ?", session['user_id'])
    return redirect("/")

