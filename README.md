# Habit Tracker

A modern, interactive web application for tracking daily, weekly, and monthly habits with visual progress monitoring and streak tracking.

## Features

- 📊 Visual progress tracking with interactive charts
- 🔥 Streak counting and monitoring
- 📅 Support for daily, weekly, and monthly habits
- ⏰ Customizable reminders
- 📱 Responsive design for desktop and mobile
- ✨ Modern, clean user interface

## Tech Stack

- **Backend**: Python Flask
- **Database**: SQLite with SQLAlchemy
- **Frontend**: 
  - Bootstrap 5 for UI components
  - Chart.js for data visualization
  - Vanilla JavaScript for interactivity

## Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux/MacOS
   python -m venv venv
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the application:
   ```bash
   python app.py
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Usage

### Adding a New Habit

1. Click the "Add New Habit" button
2. Fill in the habit details:
   - Name (required)
   - Description (optional)
   - Frequency (daily/weekly/monthly)
   - Reminder time (optional)
3. Click "Add Habit" to save

### Tracking Progress

- Click "Mark Complete" to log a habit completion
- View your current streak next to each habit
- Monitor your progress through the visual chart
- Charts show the last 7 days of activity

## Project Structure

```
habit_tracker/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── static/
│   └── js/
│       └── main.js    # Frontend JavaScript
├── templates/
│   └── index.html     # Main HTML template
└── instance/
    └── habits.db      # SQLite database
```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/improvement`)
6. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Flask](https://flask.palletsprojects.com/) - Web framework
- [Bootstrap](https://getbootstrap.com/) - UI framework
- [Chart.js](https://www.chartjs.org/) - JavaScript charting library
- [SQLAlchemy](https://www.sqlalchemy.org/) - Database ORM
