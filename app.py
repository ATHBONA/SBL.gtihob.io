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
        "title": "Mathcad 15",
        "developer": "Mathcad",
        "description": "More than just a calculator or math engine, Mathcad is an interactive digital notebook that lets you write equations in standard math notation, apply units, visualize data, and annotate your work—all in one professionally formatted document.",
        "category": "software",
        "rating": 4.6,
        "size": "228.02 MB",
        "featured": True,
        "image": "/static/img/apps/Mathcad 15.jpg",
        "badge": "POPULAR",
        "download_url": "https://www.mediafire.com/file/mz5asd0wmoh5epd/Mathcad+15.rar/file"
    },
    {
        "id": 3,
        "title": "SketchUp 2024",
        "developer": "SketchUp",
        "description": "SketchUp 2024, a powerful feature that adds depth and realism to your models. By simulating how light interacts with objects and edges, ambient occlusion helps you create lifelike designs with minimal effort.",
        "category": "software",
        "rating": 4.7,
        "size": "1.1 GB",
        "featured": False,
        "image": "/static/img/apps/SketchUp 2024.jpg",
        "download_url": "https://drive.usercontent.google.com/download?id=1FHMfJpiwJP9uFxJgU2_qR9lOK2e9nUHD&export=download&authuser=0"
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
