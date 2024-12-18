import pandas as pd
from googletrans import Translator

# Initialize the Google Translator
translator = Translator()

# Read the CSV file into a DataFrame
input_file = 'symptom_precaution.csv'  # Replace with your file name
df = pd.read_csv(input_file)

# Define the columns to translate (from 2nd column to n-th column)
columns_to_translate = df.columns[1:]  # Skipping the first column (index 0)

# Translate each row for each of the columns from 2 -> n
for col in columns_to_translate:
    df[col] = df[col].apply(lambda x: translator.translate(x, src='en', dest='vi').text if isinstance(x, str) else x)

# Save the translated DataFrame to a new CSV file
output_file = 'symptom_precaution_translated.csv'  # Replace with your desired output file name
df.to_csv(output_file, index=False)

print(f"Translation complete. The translated file has been saved as {output_file}.")
