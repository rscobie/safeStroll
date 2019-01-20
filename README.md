# safeStroll
Hack Arizona 2019 Submission, a webapp that predicts safe routes for pedestrians using machine learning and data-driven decision making.
Our crime data comes from the Tucson Police Department and the University of Arizona Police Department incident datasets. Both were accessed through Socrata. We parsed this data for violent crimes such as assaults, homicide, and robberies. From here, we extracted the latitudes and longitudes of the crime location and assigned weights to the crime type. Homicides were weighted the highest, assaults were weighted lower based on other attributes like whether a deadly weapon was used or it was a sexual assault. 

TPD incident dataset:
https://moto.data.socrata.com/dataset/Tucson-Police-Department/5e96-55x5

UAPD incident dataset:
https://moto.data.socrata.com/dataset/The-University-of-Arizona-Police-Department/tg4d-cwgz

Streetlights dataset:
http://gisdata.tucsonaz.gov/datasets/streetlights-city-of-tucson-open-data

Bicycle traffic incident dataset:
https://azbikelaw.org/crashmap-data/

