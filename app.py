from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
import tensorflow as tf
from keras.applications.vgg16 import preprocess_input
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


model = tf.keras.models.load_model('../model.keras')

@app.route('/classify', methods=['POST'])
def classify_image():

    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    

    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    try:
        image = Image.open(file)
        image = image.resize((100, 100))  # Resize to match model input
        image_array = np.array(image)

        image_array = preprocess_input(image_array)
        image_array = image_array.reshape(1, 100, 100, 3)  # Reshape for model input

        y_pred = model.predict(image_array)
        y_pred_value = y_pred[0][0]

        if y_pred_value > 0.7 and y_pred_value < 1.0:
            pred = 'cat'
        elif y_pred_value < 0.3 :
            pred = 'dog'
        else:
            pred = 'Not a dog or cat'

        confidence_score = float(y_pred_value)
        return jsonify({
            "prediction": pred,
            "confidence": confidence_score
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
