# BajajFinserv-OA
> _for my reference only_


## Problem Statement
A developer in your team has developed an API to create an account for a new user. You need to
validate this API in as many different angles as possible.
#### Here are the API details
- API endpoint- ```https://xxxxxxxxxxxx.co.in/automation-campus/create/user```
 
#### API curl –
```
curl --location 'https://bxxxxxxxxxxx.co.in/automation-campus/create/user' \
--header 'roll-number: 1' \
--header 'Content-Type: application/json' \
--data-raw '{
"firstName": "Test",
"lastName": "Test",
"phoneNumber": 9999999999,
"emailId": "test.test@test.com"
}'
```
#### Headers -
```roll-number (required field)```
#### Body -
```
firstName (required field)
lastName (required field)
phoneNumber (required field, phoneNumber cannot be duplicate between multiple users )
emailId (required field, emailId cannot be duplicate between multiple users )
```
You can use any language/ tool to implement test cases. Students implementing most test cases
will get selected for the next round. Please note - if you don't send your roll number in the header
you will not get credits for that test case.


## Installation
- have node
-  ```npm init -y```
- ```npm install jest axios```
- update ```package.json```
- ```npm test``` or ```npx jest userApi.test.js```
- ```API_BASE_URL=https://cccccc.co.in/automation-campus/create/user``` and 
```ROLL_NUMBER=2222``` are both in ```.env```
