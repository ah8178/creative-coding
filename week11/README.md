# Week 11 — Data Visualization / Data Portraiture

**Question:** Which kinds of 311 service requests appear most often in each NYC borough, and how does that pattern change by place?

## Project: A City of Requests

The sketch queries NYC Open Data's public 311 Service Requests dataset, groups 2025 requests by borough and complaint type, and lets viewers compare the top reported request categories.

- Keys 1–5: select a borough.
- A: compare all five boroughs.
- R: refresh the data.

## Data source

NYC Open Data, [311 Service Requests from 2020 to Present](https://data.cityofnewyork.us/resource/erm2-nwe9.json). The sketch filters the dataset to records created from January 1 through December 31, 2025.

The dataset is updated daily and represents requests that can be directed to specific city agencies. A 311 request is not a complete measure of every issue in a neighborhood; reporting access and category definitions affect the data.

## Run it

Open `index.html` with VS Code Live Server. The sketch fetches data from NYC Open Data, so an internet connection is required.

## Before submitting

- [ ] Run the sketch and confirm the data loads.
- [ ] Explain why you chose this dataset and question.
- [ ] Discuss what the visualization reveals and what it cannot reveal.
- [ ] Include a screenshot and cite the dataset.
- [ ] Add your own interpretation of at least one borough comparison.

## AI assistance disclosure

This starter code was created with AI assistance. Review and revise it, understand the API query and aggregation, and follow your instructor's attribution requirements.