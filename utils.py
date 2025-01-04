import datetime
import pandas as pd

def preprocess(df):

    # Drop null values
    df = df.dropna()
    
    # Only released movies
    df = df[df['status'] == 'Released']

    # Add timestamp column
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    df['timestamp'] = pd.to_datetime(today)

    return df
