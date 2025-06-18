from flask import Flask, render_template, jsonify, request
import os
import re
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/img/apps'

# Sample app data with download links
APPS = [
    {
        "id": 1,
        "title": "CSiCol v11.0.0",
        "developer": "CSi",
        "description": "Comprehensive software package for analysis and design of columns. Can design columns of any concrete, reinforced concrete, or composite cross-section.",
        "category": "software",
        "rating": 4.8,
        "size": "220.99 MB",
        "featured": True,
        "image": "/static/img/apps/csicol.jpg",
        "badge": "NEW",
        "download_url": "https://www.mediafire.com/file/gtnt3ky9kkgoo18/CSI_CSiCol_11.0.0_Build_1104.rar/file"
    },
    {
        "id": 2,
        "title": "Music Player Deluxe",
        "developer": "Audio Masters",
        "description": "Premium music player with equalizer and playlist management features.",
        "category": "music",
        "rating": 4.6,
        "size": "32 MB",
        "featured": True,
        "image": "/static/img/apps/csicol.jpg",
        "badge": "POPULAR",
        "download_url": "https://example.com/downloads/music-player-deluxe.apk"
    },
    {
        "id": 3,
        "title": "Photo Editor Pro",
        "developer": "Creative Tools",
        "description": "Advanced photo editing tools with filters and effects.",
        "category": "tools",
        "rating": 4.7,
        "size": "45 MB",
        "featured": False,
        "image": "/static/img/apps/csicol.jpg",
        "download_url": "https://example.com/downloads/photo-editor-pro.apk"
    }
]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/apps')
def get_apps():
    search_query = request.args.get('search', '').lower()
    name_query = request.args.get('name', '').lower()
    
    filtered_apps = APPS
    
    if search_query:
        filtered_apps = [app for app in filtered_apps if search_query in app['title'].lower() or 
                        search_query in app['description'].lower()]
    
    if name_query:
        filtered_apps = [app for app in filtered_apps if name_query == app['title'].lower()]
    
    return jsonify(filtered_apps)

@app.route('/app/<int:app_id>')
def app_detail(app_id):
    app = next((app for app in APPS if app['id'] == app_id), None)
    if app:
        return render_template('app_detail.html', app=app)
    return render_template('404.html'), 404

@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    email = request.form.get('email', '').strip()
    
    if not email or not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"error": "Please enter a valid email address"}), 400
    
    # In a real app, you would store this in a database
    print(f"New subscriber: {email}")
    
    return jsonify({
        "message": "Thank you for subscribing! You'll receive our updates soon.",
        "email": email
    })

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(debug=True)