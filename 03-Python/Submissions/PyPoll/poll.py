import csv

csvpath = r"PyPoll/Resources/election_data.csv"
print(csvpath)

#counting total votes
totalVotes = 0

candidateDict = {}

#reading csv file
with open(csvpath, "r") as csvfile:
    csvreader = csv.reader(csvfile, delimiter=',')

    # Read the header row first (skip this step if there is no header)
    csv_header = next(csvreader)
    print(f"CSV Header: {csv_header}")

    # Read each row of data after the header
    for row in csvreader:
        #print(row)
        totalVotes = totalVotes + 1

        #if candidate is in dict then add 1 to value
        #if candidate is not in dict then create new item and intialize value 1
        candidate = row[2]
        if row[2] in candidateDict.keys():
            candidateDict[candidate] += 1
        else:
            candidateDict[candidate] = 1
            

print(totalVotes)
print(candidateDict)

#googled
winner = max(candidateDict, key=candidateDict.get)
print(winner)

candidateString = [f"{key}: {round((candidateDict[key] / totalVotes)*100,3)}% ({candidateDict[key]})" for key in candidateDict.keys()]
candidateString = "\n".join(candidateString) #googled

summString = f"""Election Results
- - - - - - - - - - - - - 
Total Votes: {totalVotes}
- - - - - - - - - - - - - 
{candidateString}
- - - - - - - - - - - - - 
Winner: {winner}
- - - - - - - - - - - - - """

#writing summ table
with open("poll_results.txt", "w") as file1:
    file1.write(summString)