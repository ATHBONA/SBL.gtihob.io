# app.py
from flask import Flask, render_template, send_from_directory, jsonify, request
import os

app = Flask(__name__)

# Sample app data with download links
APPS = [
    {
        "id": 1,
        "title": "CSiCol v11.0.0",
        "developer": "CSi.",
        "description": "comprehensive software package used for the analysis and design of columns. The design of columns of any concrete, reinforced concrete, or composite cross-section can be carried out by the program.",
        "category": "software",
        "rating": 4.8,
        "size": "220.99 MB",
        "featured": False,
        "image": "../static/img/app/CSI_CSiCol_11.0.0_Build_1104.jpg",
        "badge": "NEW",
        "download_url": "https://www.mediafire.com/file/gtnt3ky9kkgoo18/CSI_CSiCol_11.0.0_Build_1104.rar/file"  # Added download URL
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
        "image": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        "badge": "POPULAR",
        "download_url": "https://example.com/downloads/music-player-deluxe.apk"  # Added download URL
    },

]

# Ensure downloads directory exists
DOWNLOADS_DIR = 'downloads'
os.makedirs(DOWNLOADS_DIR, exist_ok=True)

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

@app.route('/download/<int:app_id>')
def download_app(app_id):
    filename = f"app_{app_id}.apk"
    filepath = os.path.join(DOWNLOADS_DIR, filename)
    if not os.path.exists(filepath):
        open(filepath, 'w').close()
    
    return send_from_directory(
        DOWNLOADS_DIR,
        filename,
        as_attachment=True,
        download_name=f"app_{app_id}_download.apk"
    )

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