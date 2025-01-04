import pandas as pd

def compare_2_rows(row1, row2):
    # Compare all columns except 'timestamp'
    for col in row1.index:
        if col != 'timestamp':
            if row1[col] != row2[col]:
                return False
    return True

def update_df(df, updated_df):
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
