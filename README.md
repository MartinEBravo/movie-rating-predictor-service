# movie-rating-predictor-service

## Overview

This project is a serverless machine learning system that predicts IMDb ratings for movies using a dynamic dataset from [Kaggle](https://www.kaggle.com/datasets/alanvourch/tmdb-movies-daily-updates/data). The system comprises four main pipelines:

1. `1_historical_data`: Backfills the feature store with historical data.
2. `2_feature_pipeline`: Updates the feature store daily with new data.
3. `3_training_pipeline`: Trains the machine learning model.
4. `4_inference_pipeline`: Uses the trained model to predict ratings for new movies.

To monitor predictions, a user interface (UI) was developed. Users can explore different movies, view their predicted ratings alongside their posters, and click on a movie to be redirected to its IMDb page for the actual rating.

This project leverages **Hopsworks** for the feature store and **GitHub Actions** for automating the daily workflows.

![image](imgs/img1.png)

---

## Dataset

The dataset used is from [Kaggle](https://www.kaggle.com/datasets/alanvourch/tmdb-movies-daily-updates/data), containing the complete movie list from The Movie Database (TMDB) along with IMDb information. It includes 28 columns, such as:

- `vote_average`, `vote_count`, `status`, `release_date`, `revenue`, `runtime`, `budget`
- `imdb_rating`, `imdb_votes`, `original_language`, `overview`, `popularity`, `tagline`
- `genres`, `production_companies`, `production_countries`, `cast`, `producers`, `directors`, `writers`

The dataset is updated daily, ensuring its dynamic nature.

---

## Methodology

### Historical Backfilling

The `1_historical_data` pipeline filters movies with a `status` of `"Released"`, as movies without IMDb ratings cannot be used as targets for training. Data cleaning was also performed where columns with missing data were dropped.

### Feature Engineering
Features ‘vote_average’ and ‘popularity’ were removed since they can be seen as measures of the movie’s rating and we wanted the model to predict the rating without using a similar score as a variable. Since the target to predict was imdb rating, ‘vote_count’ associated with ‘vote_average’ was not relevant either. Release date was converted to release_year, grouping the movies made in the same year together.

We created new features from the “producers”, “cast” and “production_companies” through choosing the first value in each cell creating “first_producer”, “first_actor”, and “first_company” and label encoding them. The “genres” column was also one-hot encoded and uploaded to a new feature group, which then in the training pipeline was merged with the initial feature group.

There was also evaluation done on including or removing the categorical feature original_language and the results showed the model had a lower MSE score and higher R2 value when keeping this variable. The final features used for the training of the models were: budget, runtime, release_year, imdb_votes, original_language, first_producer, first_actor, first_company and the one-hot encoding for the 19 unique genres, giving a total of: 27 features.

Final features used for training included:

- `budget`, `runtime`, `release_year`, `imdb_votes`
- `first_producer`, `first_actor`, `first_company`, `original_language`
- One-hot encoded `genres` (19 unique genres)

This resulted in a total of **27 features**.

### Model Selection

The following models were evaluated:

- **XGB Regressor** (Best-performing model)
- Random Forest Regression
- Linear Regression
- SVR (Support Vector Regressor)
- Decision Tree Regressor

For inference, predictions were also made for movies with a `status` of `"Post Production"`. For these movies, the `imdb_votes` feature was estimated as `400`.

The UI displays predictions and actual ratings for 20 newly updated movies.

---

## Results

- **Best Model**: XGB Regressor
- **Performance Metrics**:
  - **MSE**: 0.51
  - **R²**: 0.60
- **Runner-up**: Random Forest Regressor

This setup balances simple and complex models, ensuring suitability across varying dataset sizes.

---

## How to Run the Code

1. Create a profile on [Hopsworks.ai](https://www.hopsworks.ai/) and generate an API key.
2. Set up a GitHub account to automate workflows.
3. Clone this repository:
   ```bash
   git clone https://github.com/your-repo/movie-rating-predictor-service.git
   cd movie-rating-predictor-service
