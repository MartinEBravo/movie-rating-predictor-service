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

def split_genres(df):
    # Split the genres into separate rows and one-hot encode
    df_encoded = df.copy()
    df_encoded['genres'] = df_encoded['genres'].str.split(', ')  # Split by comma and space
    genres_encoded = df_encoded['genres'].explode()  # Flatten the list
    one_hot = pd.get_dummies(genres_encoded).groupby(level=0).sum()

    one_hot.columns = one_hot.columns.str.lower()  # Lowercase column names
    one_hot.columns = one_hot.columns.str.replace(' ', '_')  # Replace spaces with underscores

    # Merge one-hot encoding with the original DataFrame
    df_encoded = pd.concat([df[["id", "timestamp"]], one_hot], axis=1)

    return df_encoded

def compare_2_rows(row1, row2):
    # Compare all columns except 'timestamp'
    for col in row1.index:
        if col != 'timestamp':
            if row1[col] != row2[col]:
                return False
    return True

def merge_df(df, updated_df):
    # Ensure timestamps are in proper datetime format
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    updated_df['timestamp'] = pd.to_datetime(updated_df['timestamp'])

    # Iterate through updated_df
    for _, updated_row in updated_df.iterrows():
        id = updated_row['id']
        if id in df['id'].values:
            # Locate the index of the matching row in the original dataframe
            idx = df.index[df['id'] == id].tolist()[0]
            original_row = df.loc[idx]
            if not compare_2_rows(original_row, updated_row):
                # Update the values for the row explicitly
                df.loc[idx, :] = updated_row.values
        else:
            # Add new row as a DataFrame and concatenate
            new_row = pd.DataFrame([updated_row])
            df = pd.concat([df, new_row], ignore_index=True)

    return df