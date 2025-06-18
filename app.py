from flask import Flask, render_template, send_from_directory, jsonify, request
import os

app = Flask(__name__)

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
        "image": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
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
        "image": "https://images.unsplash.com/photo-1575936123452-b67c3203c357",
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
        filtered_apps = [app for app in filtered_apps if search_query in app['title'].lower()]
    
    if name_query:
        filtered_apps = [app for app in filtered_apps if name_query == app['title'].lower()]
    
    return jsonify(filtered_apps)

@app.route('/app/<int:app_id>')
def app_detail(app_id):
    app = next((app for app in APPS if app['id'] == app_id), None)
    if app:
        return render_template('app_detail.html', app=app)
    return "App not found", 404

@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    email = request.form.get('email')
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    print(f"New subscriber: {email}")
    
    return jsonify({
        "message": "Thank you for subscribing! You'll receive our updates soon.",
        "email": email
    })

@app.route('/api/app/<int:app_id>')
def get_app_info(app_id):
    app = next((app for app in APPS if app['id'] == app_id), None)
    if app:
        return jsonify(app)
    return jsonify({"error": "App not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)