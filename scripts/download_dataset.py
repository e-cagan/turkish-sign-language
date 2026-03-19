"""
Module to download dataset
"""

import os
import sys
from dotenv import load_dotenv
from roboflow import Roboflow


if __name__ == '__main__':
    # Load the api key from .env
    load_dotenv()

    # Check the API key exists
    api_key = os.getenv('ROBOFLOW_API_KEY')
    if not api_key:
        print("Error: ROBOFLOW_API_KEY couldn't found!")
        print('  Create .env file:')
        print('  echo "ROBOFLOW_API_KEY=rf_xxxxx" > .env')
        sys.exit(1)

    # Download the dataset
    rf = Roboflow(api_key=api_key)
    project = rf.workspace("turk-isaret-dili-uygulamasi").project("turk-isaret-dili-uygulamasi")
    version = project.version(3)
    dataset = version.download("yolov8")