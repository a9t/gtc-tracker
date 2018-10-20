# GTC Community Progress Tracker

This is a Google Apps Scripts project I wrote a few years back to track the progress of my community, since at the time GTC had no such tool available. While the situation has improved somewhat, I still rely on this tool to check for discrepancies in GTC's reporting and the overall progress in my community.

## Work in progress

I am using [clasp](https://github.com/google/clasp) to make my project available for other communities and taking this opportunity to refactor the project.

Also, I am taking this opportunity to clean some of the code (and maybe add some new functionality). Over time, a lot of things changed in the products this project interacts with, which required fixes that I performed in a hurry, so there is quite a lot of dead useless code hanging around.

### Todos

- cleanup the translator storage format
- add the support functionality - dates, GTC server interaction, etc.
- add the daily translator contribution functionality
- separate the CRON/trigger functions for easier maintainability
- improve documentation
- ? revive the project tracking functionality
- ? add some notification mechanism if weird data are read
- ? automate the authentication to GTC

