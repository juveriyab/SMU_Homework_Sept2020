import csv
import numpy as np

csvpath = r"PyBank/Resources/budget_data.csv"
print(csvpath)

totalMonths = 0
totalProfit = 0

firstRow = True 
lastRowProfit = 0
changeDict = {}

#reading csv file
with open(csvpath, "r") as csvfile:
    csvreader = csv.reader(csvfile, delimiter=',')

    # Read the header row first (skip this step if there is no header)
    csv_header = next(csvreader)
    #print(f"CSV Header: {csv_header}")

    # Read each row of data after the header
    for row in csvreader:
        #print(row)

        #row[0] = Month/Year
        #row[1] = Profit/Loss

        totalMonths += 1
        totalProfit += int(row[1])

        if firstRow:
            lastRowProfit = int(row[1])
            firstRow = False
        else:
            change = int(row[1]) - lastRowProfit
            changeDict[row[0]] = change
            lastRowProfit = int(row[1])

avgChange = (np.mean(list(changeDict.values())))

#googled
maxMonthChange = max(changeDict, key=changeDict.get)
maxValueChange = changeDict[maxMonthChange]

minMonthChange = min(changeDict, key=changeDict.get)
minValueChange = changeDict[minMonthChange]

summString = f"""Financial Analysis
- - - - - - - - - - - - - 
Total Months: {totalMonths}
Total: ${totalProfit}
Average Change: ${round(avgChange, 2)}
Greatest Increase in Profits: {maxMonthChange} (${maxValueChange})
Greatest Decrease in Profits: {minMonthChange} (${minValueChange})"""

#writing summ table
with open("bank_results.txt", "w") as file1:
    file1.write(summString)

