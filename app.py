# import necessary libraries
import pandas as pd
import Pybiodiversity

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import (
    Flask,
    render_template,
    jsonify)

app = Flask(__name__)



@app.route("/sample/<sample_number>")
def sample(sample_number):
    personal = Pybiodiversity.getPersonInfo(sample_number)
    washing_frequency = Pybiodiversity.getWashingFrequency(sample_number)
    otu_distribution = Pybiodiversity.getOtuDistribution(sample_number)
    data = {
        'personal':personal,
        'washing_frequency':washing_frequency,
        'otu_distribution':otu_distribution
    }
    return  jsonify(data)

@app.route("/names")
def names():
    data = Pybiodiversity.getSampleList()
    return  jsonify(data)

@app.route("/otu")
def otu():
    data = Pybiodiversity.getOtuSampleRelation()
    return  jsonify(data)

@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
