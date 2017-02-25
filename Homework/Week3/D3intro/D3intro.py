#
# Filename : D3intro.py
# Project : Dataprocessing - Week 3 - D3intro
#
# Author : E.H.Steffens
# Date : 22-02-2017
#
# Desription : Converts csv formatted files to JSON

import csv
import json
import re

# csv variables
delimiter_csv = ','
filename_csv = 'KNMI_20170220.csv'
fieldnames_csv = ['Station', 'Date', 'tp', 'vis']

# JSON variables
filename_json = 'KNMI_20170220.json'

# Read the csv file into a object
file_csv = open(filename_csv, 'rb')
object_csv = csv.DictReader(file_csv, fieldnames=fieldnames_csv, delimiter  = delimiter_csv)
object_json = list(object_csv)

# Convert to json
with open(filename_json, 'w') as filename_json:
    json.dump(object_json, filename_json)

file_csv.close
