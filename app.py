from flask import Flask, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
import sqlite3
from cs50 import SQL

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Configure session to use filesystem 
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

db = SQL("sqlite:///scores.db")

@app.route("/")
def index():
    if session.get("user") == None:
        return redirect("/login")
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":

        username = request.form.get("username")
        password = request.form.get("password")

        # check user input
        if not username: 
            return render_template("apology.html")
        
        user = db.execute("SELECT * FROM users WHERE username = ?", username)

        # check user password and that it matches the password from the database
        if len(user) < 1 or not check_password_hash(user[0]['password'], password):
            return render_template("apology.html")

        # Set the session to the current user
        session['user'] = user[0]['id']

        return redirect("/")
    return render_template("login.html")

@app.route("/logout", methods=["GET", "POST"])
def logout():
    # log the user out
    if request.method == "POST":
        session['user'] = None
        return redirect("/login")

    session['user'] = None
    return redirect("/login")

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":

        username = request.form.get("username")
        password = request.form.get("password")
        confirmation_password = request.form.get("confirmation")

        # Execute SQL for existing user
        existing_user = db.execute("SELECT * FROM users WHERE username = ?", username);
        
        # Check user input
        if not username or len(existing_user) > 0:
            return render_template("apology.html")

        # Check Password Input
        if not password or password != confirmation_password:
            return render_template("apology.html")

        # Add user to the data base
        new_user = db.execute("INSERT INTO users (username, password) VALUES (?, ?)", username, generate_password_hash(password))
    
        # Set the session to the current user
        session['user'] = new_user

        return redirect("/")
    return render_template("register.html")