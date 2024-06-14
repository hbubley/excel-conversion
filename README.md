## Excel Converter

This is a simple Node.js application for converting a specific input CSV file to JSON format using TypeScript. The project reads an input CSV file named input.csv, manipulates the data, and produces an output file named output.json.

### Prerequisites
- Node.js (version >= 14.17)
- npm (Node Package Manager)

### Installation
1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/hbubley/excel-conversion.git
   ```

2. Navigate to the project directory:

    ```bash
    cd excel-conversion
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

### Usage
1. Run the following command:

    ```bash
    npm run script
    ```
After the conversion process is completed, you will find the output JSON file named output.json in the project directory.

3. **Extra** Compare results and confirm output matches expected result:
    ```bash
    npm run compare-json
    ```

### Test Usage
1. Ensure mocha is globally installed:

    ```bash
    npm install -g mocha
    ```

2. Run the following command:

    ```bash
    npm run test
    ```

### Script Details
#### Conversion Script (npm run script):
This script reads the input.csv file, processes the data, and generates an output.json file.

#### Comparison Script (npm run compare-json):
This script compares the generated output.json file with the expected output to ensure correctness.