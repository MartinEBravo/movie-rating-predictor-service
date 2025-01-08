# Serverless Machine Learning System for IMDb Movie Rating Prediction

## Overview
This repository contains a serverless machine learning system that dynamically predicts the IMDb ratings of movies using a Kaggle dataset. It features four pipelines:

1. **Historical Data Pipeline**: Backfills the feature store with historical data.
2. **Feature Pipeline**: Handles daily data updates.
3. **Training Pipeline**: Trains the machine learning model.
4. **Inference Pipeline**: Uses the trained model to predict ratings for new movies.

A user interface (UI) is available for monitoring predictions. The website allows users to explore different movies, view predicted ratings, and navigate to the IMDb page of a selected movie to see its actual IMDb rating. 

Key technologies used include Hopsworks for the feature store and GitHub Actions for automating daily workflows and pipeline execution.

## Dataset
The dataset originates from Kaggle and contains The Movie Database (TMDB) full movie list with IMDb information. It includes 28 columns such as `vote_average`, `vote_count`, `status`, `release_date`, `revenue`, `runtime`, `budget`, `imdb_rating`, `imdb_votes`, `original_language`, `popularity`, `genres`, `production_companies`, `production_countries`, `cast`, `producers`, `directors`, and `writers`. This dataset is updated daily, making it dynamic and continuously evolving.

## Methodology

### Historical Backfilling
Historical data backfilling was done by filtering movies with the `status` set to "Released," ensuring that IMDb ratings were available for training. Missing data columns were dropped, and data cleaning was performed.

### Feature Engineering
- Features `vote_average` and `popularity` were removed to ensure the model predicted IMDb ratings without bias from similar metrics.
- `vote_count`, which correlated with `vote_average`, was excluded.
- `release_date` was transformed into `release_year` to group movies by production year.
- New features were created:
  - `first_producer`, `first_actor`, and `first_company` by extracting the first value from respective columns and applying label encoding.
  - One-hot encoding was applied to the `genres` column, creating a separate feature group that was merged with the main feature group during training.
- The `spoken_language` categorical feature was excluded after evaluation showed better performance without it.

The final feature set included `budget`, `runtime`, `release_year`, `imdb_votes`, `first_producer`, `first_actor`, `first_company`, one-hot encoded genres, and a total of 27 features.

### Models
The following models were compared:
- XGB Regressor
- Random Forest Regression
- Linear Regression
- SVR
- Decision Tree Regressor

The **XGB Regressor** emerged as the best-performing model, with an MSE of 0.51 and an R-squared value of 0.60. The Random Forest Regressor performed closely, offering a balance between simplicity and complexity suitable for varying dataset sizes.

### Inference Pipeline
For the inference pipeline, predictions were made for both newly released movies and movies in "Post Production" status. For unreleased movies, an estimated `imdb_votes` value of 400 was used. The website displayed predicted and actual ratings for 20 newly updated movies.

## Results
The results demonstrated the effectiveness of the XGB Regressor, outperforming other models. The inclusion of a mix of simple and complex models ensured adaptability to different data scenarios.

## How to Run the Code
1. Create a profile on [Hopsworks.ai](https://www.hopsworks.ai/) and obtain an API key.
2. Create a GitHub account to enable the daily workflow.
3. Clone this repository and install the required dependencies.
4. Execute the following steps:
   - Run `1_historical_data.ipynb` to backfill the feature store.
   - Run `3_training_pipeline.ipynb` to train the model.
5. Use GitHub Actions to automate the execution of `2_feature_pipeline.ipynb` and `4_inference_pipeline.ipynb` daily.
