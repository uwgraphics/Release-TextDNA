from flask import render_template, send_from_directory, request, redirect, url_for, jsonify, g
from werkzeug import secure_filename

from app import app, scripts
from scripts import buildDataset
import sqlite3
import forms
import os



@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html")

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    # Get the name of the uploaded file
    file = request.files['datafile']
    # Check if the file is one of the allowed types/extensions
    if file and allowed_file(file.filename):
        # Make the filename safe, remove unsupported chars
        filename = secure_filename(file.filename)
        dataset = buildDataset.build(file)

        return render_template("vis.html", data=dataset)
        
        
        # Move the file form the temporal folder to
        # the upload folder we setup
        #file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        # Redirect the user to the uploaded_file route, which
        # will basicaly show on the browser the uploaded file
        #return redirect(url_for('uploaded_file',
        #                       filename=filename))

@app.route('/viewer')
def test():
    return render_template("viewer.html")

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory("..\\"+app.config['UPLOAD_FOLDER'],
                               filename)

