from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import os
from dateutil import parser
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///habits.db'
db = SQLAlchemy(app)

class Habit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))
    frequency = db.Column(db.String(50), nullable=False)  # daily, weekly, monthly
    reminder_time = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class HabitLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    habit_id = db.Column(db.Integer, db.ForeignKey('habit.id'), nullable=False)
    completed_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    habits = Habit.query.all()
    return render_template('index.html', habits=habits)

@app.route('/add_habit', methods=['POST'])
def add_habit():
    name = request.form.get('name')
    description = request.form.get('description')
    frequency = request.form.get('frequency')
    reminder_time = request.form.get('reminder_time')
    
    habit = Habit(
        name=name,
        description=description,
        frequency=frequency,
        reminder_time=reminder_time
    )
    db.session.add(habit)
    db.session.commit()
    
    return redirect(url_for('index'))

@app.route('/log_completion/<int:habit_id>', methods=['POST'])
def log_completion(habit_id):
    log = HabitLog(habit_id=habit_id)
    db.session.add(log)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/get_stats/<int:habit_id>')
def get_stats(habit_id):
    habit = Habit.query.get_or_404(habit_id)
    logs = HabitLog.query.filter_by(habit_id=habit_id).all()
    
    # Calculate streak
    if not logs:
        return jsonify({'current_streak': 0, 'longest_streak': 0, 'completion_dates': []})
    
    completion_dates = [log.completed_at.date() for log in logs]
    completion_dates.sort()
    
    # Calculate current streak
    current_streak = 0
    today = datetime.utcnow().date()
    check_date = today
    
    while check_date in completion_dates:
        current_streak += 1
        check_date -= timedelta(days=1)
    
    # Calculate longest streak
    longest_streak = current_streak
    temp_streak = 0
    
    for i in range(len(completion_dates)-1):
        if (completion_dates[i+1] - completion_dates[i]).days == 1:
            temp_streak += 1
            longest_streak = max(longest_streak, temp_streak)
        else:
            temp_streak = 0
    
    return jsonify({
        'current_streak': current_streak,
        'longest_streak': longest_streak,
        'completion_dates': [date.strftime('%Y-%m-%d') for date in completion_dates]
    })

if __name__ == '__main__':
    app.run(debug=True)
