# Python SQL toolkit and Object Relational Mapper
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import func, desc
from sqlalchemy.orm import load_only

# Create engine using the database file
engine = create_engine("sqlite:///belly_button_biodiversity.sqlite")

# Declare a Base using `automap_base()`
Base = automap_base()

# Use the Base class to reflect the database tables
Base.prepare(engine, reflect=True)

# Print all of the classes mapped to the Base
Base.classes.keys()

Otu = Base.classes.otu
Samples = Base.classes.samples
Samples_Metadata = Base.classes.samples_metadata


session = Session(engine)


def getOtuDistribution(sample_number):
    fields = [sample_number]
    results = session.query(Samples).options(load_only(sample_number)).order_by(desc(sample_number))
    
    distribution = []
    labels = []
    values_raw = []
    
    for r in results[:10]:
        row = r.__dict__    
        labels.append(f"Otu - {row['otu_id']}")
        values_raw.append(row[f"{sample_number}"])
    
    values = [round((x/sum(values_raw))*100,2) for x in values_raw]
        
    return {
        'labels':labels,
        'values':values
    }
        

def getPersonInfo(sample_number):
    sample_id = sample_number[3:]
    results = session.query(Samples_Metadata).    filter(Samples_Metadata.SAMPLEID == sample_id).first()
    
    print(results)
    
    return {
        'age':results.AGE,
        'gender':results.GENDER,
        'ethnicity':results.ETHNICITY,
        'location':results.LOCATION,
        'source':results.EVENT
    }

def getOtuSampleRelation(sample_number):
    results = session.query(Samples).options(load_only(sample_number)).order_by('otu_id')
    x = []
    y = []

    for r in results:
        row = r.__dict__
        sample_values = list(row.values())
        print(f"{r.otu_id}-{sample_values[2]}")
        x.append(r.otu_id)
        y.append(sample_values[2])

    return{
        'x':x,
        'y':y
    }

def getWashingFrequency(sample_number):
    sample_id = sample_number[3:]
    results = session.query(Samples_Metadata).filter(Samples_Metadata.SAMPLEID == sample_id).first()
    
    return results.WFREQ

def getSampleList():
    columns_list = Samples.__table__.columns.keys()
    return columns_list[1:]