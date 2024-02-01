from tensorflow.keras.models import load_model
import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

application = Flask(__name__)
CORS(application)

@application.route("/predict/", methods=['GET'])
def predict():

    image_name = request.args.get("imageName")
    model_path = "./brain_tumor_model_26.h5"
    model = load_model(model_path)
    img_path = "./uploads/" + image_name
    img = cv2.imread(img_path)
    img = cv2.resize(img, (224, 224))
    img = img.reshape((1, 224, 224, 3))
    img = img / 255.0

    predictions = model.predict(img)
    predicted_class = np.argmax(predictions[0])
    predicted_probability = predictions[0][predicted_class] * 100
    predicted_probability_rounded = round(predicted_probability, 2)

    results = {
        "prediction": int(predicted_class),
        "accuracy": str(predicted_probability_rounded) + "%",
    }

    response = jsonify(results)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == "__main__":
   application.run()