# GTC Community Progress Tracker

This is a Google Apps Scripts project I wrote a few years back to track the progress of my community, since at the time GTC had no such tool available. While the situation has improved somewhat, I still rely on this tool to check for discrepancies in GTC's reporting and the overall progress in my community.

## Functionality

The current implementation allows you to keep track of the daily progress of all the users in a community based on the status of the leagerboard. This means that only translators with a word count higher than 15,000 will be tracked, but this could change in the future.

## How To Use

### Deploy the project
Clone this project and then create a Google Apps Scripts project. You may create the project in 2 ways:
- create a project directly from clasp
- create a project from the web interface, clone it with claps and then push the code with clasp

### Prepare the Google Spreadsheet
Create a Google Spredsheet and  write down its id. Also write down the name of the Sheet (you may change it first, but remember what you changed it to). 

Fill in cells A1 to E1 with the following in order: Name, UserID, Total, Last 7 days, Last 30 days. These will be the stable headers for the table tracking the daily contributions of the translators in the community.

### Configure the project properties
Open the Google Apps Scripts project in your browser, go to File -> Project Properties -> Script Properties and set the following properties:
- GTC_REQUEST_COOKIE - retrieve this from the browser when you access the GTC site
- GTC_REQUEST_REFERER - set it to: https://translate-coursera.org/new_gtc/app/
- EXCLUDE_TRANSLATOR_IDS - comma separated ids of translators you want excluded; these might be people that translate in multiple languages, but not it your current on, or GTC staff
- SPREADSHEET_ID - the id you wrote down above
- SHEET_NAME_TRANSLATORS - the sheet name wrote down above
- LANGUAGE_COMMUNITY - the name of the language as it appears in the GTC leaderboard (e.g. Russian)

## Work in progress

I am using [clasp](https://github.com/google/clasp) to make my project available for other communities and taking this opportunity to refactor the project.

Also, I am taking this opportunity to clean some of the code (and maybe add some new functionality). Over time, a lot of things changed in the products this project interacts with, which required fixes that I performed in a hurry, so there is quite a lot of dead useless code hanging around.

### Todos

- revive the project tracking functionality
- ? add some notification mechanism if weird data are read
- ? automate the authentication to GTC
