require('dotenv').config();
const axios = require('axios');

const BASE_URL = process.env.API_BASE_URL;
const ROLL_NUMBER = process.env.ROLL_NUMBER;

async function createUser(payload, rollNumber = ROLL_NUMBER) {
  try {
    const response = await axios.post(BASE_URL, payload, {
      headers: {
        'roll-number': rollNumber,
        'Content-Type': 'application/json'
      }
    });
    // console.log('Data:', JSON.stringify(response.data, null, 2));
    return response;
  } catch (error) {
    // if (error.response) {
    //     // console.log('Data:', JSON.stringify(error.response.data, null, 2));
    //   } else if (error.request) {
    //     console.log('No response received:', error.request);
    //   } else {
    //     console.log('Error:', error.message);
    //   }
    return error.response;
  }
}

function printResponseData(testName, response) {
    console.log(`\n${testName} - Response Data:`);
    console.log(JSON.stringify(response.data, null, 2));
}

describe('User Creation API Tests', () => {
  


// 1. +vs TC
test('1. Successfully create a new user', async () => {
  const payload = {
    firstName: 'Test',
    lastName: 'User',
    phoneNumber: 9999999999,
    emailId: 'test.user@example.com'
  };
  const response = await createUser(payload);
  printResponseData('TC 1', response);
  expect(response.status).toBe(201);
});

 // 2. Missing Required Field
 test('2. Fail to create user with missing firstName', async () => {
  const payload = {
    lastName: 'User',
    phoneNumber: 9999999998,
    emailId: 'test.user2@example.com'
  };
  const response = await createUser(payload);
  printResponseData('TC 2', response);
  expect(response.status).toBe(400);
});

// 3. Duplicate Phone Number
test('3. Fail to create user with duplicate phone number', async () => {
  const payload1 = {
    firstName: 'Test1',
    lastName: 'User1',
    phoneNumber: 8888888888,
    emailId: 'test.user3@example.com'
  };
  await createUser(payload1);
  
  const payload2 = {
    firstName: 'Test2',
    lastName: 'User2',
    phoneNumber: 8888888888,
    emailId: 'test.user4@example.com'
  };
  const response = await createUser(payload2);
  printResponseData('TC 3', response);
  expect(response.status).toBe(400);
});

// 4. Duplicate Email
test('4. Fail to create user with duplicate email', async () => {
  const payload1 = {
    firstName: 'Test3',
    lastName: 'User3',
    phoneNumber: 7777777777,
    emailId: 'duplicate@example.com'
  };
  await createUser(payload1);
  
  const payload2 = {
    firstName: 'whoami',
    lastName: 'batman',
    phoneNumber: 3838383838,
    emailId: 'whiami@gmail.com'
  };
  const response = await createUser(payload2);
  printResponseData('TC 4', response);
  expect(response.status).toBe(400);
});

// 5. Missing Roll Number
test('5. Fail to create user without roll number', async () => {
  const payload = {
    firstName: 'Test',
    lastName: 'User',
    phoneNumber: 5555555555,
    emailId: 'test.user5@example.com'
  };
  const response = await createUser(payload, '');
  printResponseData('TC 5', response);
  expect(response.status).toBe(401);
});

// 6. Invalid Phone Number Format
test('6. Validate phone number format', async () => {
  const payload = {
    firstName: 'Test',
    lastName: 'User',
    phoneNumber: '123', // Invalid phone number
    emailId: 'test.user6@example.com'
  };
  const response = await createUser(payload);
  printResponseData('TC 6', response);
  expect(response.status).toBe(400);
});

// 7. Invalid Email Format
test('7. Validate email format', async () => {
  const payload = {
    firstName: 'Test',
    lastName: 'User',
    phoneNumber: 4444444444,
    emailId: 'invalid-email' // Invalid email
  };
  const response = await createUser(payload);
  printResponseData('TC 7', response);
  expect(response.status).toBe(400);
});

// 8. Long Input Strings
test('8. Handle very long input strings', async () => {
  const payload = {
    firstName: 'A'.repeat(1000),
    lastName: 'B'.repeat(1000),
    phoneNumber: 3333333333,
    emailId: `${'c'.repeat(900)}@example.com`
  };
  const response = await createUser(payload);
  printResponseData('TC 8', response);
  expect(response.status).toBe(400);
});

// 9. Special Characters in Names
test('9. Handle special characters in names', async () => {
  const payload = {
    firstName: 'Test@#$%',
    lastName: 'User&*()_+',
    phoneNumber: 2222222222,
    emailId: 'special.chars@example.com'
  };
  const response = await createUser(payload);
  printResponseData('TC 9', response);
  expect(response.status).toBe(201);
});

// 10. Whitespace Handling
test('10. Handle whitespace in input fields', async () => {
  const payload = {
    firstName: '  Test  ',
    lastName: '  User  ',
    phoneNumber: 1111111111,
    emailId: '  whitespace@example.com  '
  };
  const response = await createUser(payload);
  printResponseData('TC 10', response);
  expect(response.status).toBe(201);
});

// 11. Case Sensitivity in Email
test('11. Check case sensitivity for email addresses', async () => {
  const payload1 = {
    firstName: 'Test5',
    lastName: 'User5',
    phoneNumber: 9876543210,
    emailId: 'case.sensitive@example.com'
  };
  await createUser(payload1);
  
  const payload2 = {
    firstName: 'Test6',
    lastName: 'User6',
    phoneNumber: 9876543211,
    emailId: 'CASE.SENSITIVE@EXAMPLE.COM'
  };
  const response = await createUser(payload2);
  printResponseData('TC 11', response);
  expect(response.status).toBe(400);
});

// 12. Boundary Value for Phone Number
test('12. Test boundary values for phone number', async () => {
  const payload = {
    firstName: 'Boundary',
    lastName: 'Test',
    phoneNumber: 10000000000, 
    emailId: 'boundary@example.com'
  };
  const response = await createUser(payload);
  printResponseData('TC 12', response);
  expect(response.status).toBe(400);
});

// 13. Empty Strings
test('13. Handle empty strings for required fields', async () => {
  const payload = {
    firstName: '',
    lastName: '',
    phoneNumber: 1234567890,
    emailId: 'empty@example.com'
  };
  const response = await createUser(payload);
  printResponseData('TC 13', response);
  expect(response.status).toBe(400);
});

// 14. Numeric Values in Name Fields
test('14. Handle numeric values in name fields', async () => {
  const payload = {
    firstName: '123',
    lastName: '456',
    phoneNumber: 9876543212,
    emailId: 'numeric.name@example.com'
  };
  const response = await createUser(payload);
  printResponseData('TC 14', response);
  expect(response.status).toBe(400);
});

// 15. SQL Injection Attempt
test('15. Prevent SQL injection in input fields', async () => {
  const payload = {
    firstName: "Robert'; DROP TABLE Users; --",
    lastName: 'User',
    phoneNumber: 9876543213,
    emailId: 'sql.injection@example.com'
  };
  const response = await createUser(payload);
  printResponseData('TC 15', response);
  expect(response.status).not.toBe(500);
});


// 16. International Phone Numbers
test('16. Handle international phone numbers', async () => {
  const payload = {
    firstName: 'International',
    lastName: 'User',
    phoneNumber: '+442071234567', 
    emailId: 'international@example.com'
  };
  const response = await createUser(payload);
  printResponseData('TC 16', response);
  expect(response.status).toBe(400); 
});

// 17. Unicode Characters in Names
test('17. Handle Unicode characters in names', async () => {
  const payload = {
    firstName: 'राम',
    lastName: '谢谢',
    phoneNumber: 9876543214,
    emailId: 'unicode@example.com'
  };
  const response = await createUser(payload);
  printResponseData('TC 17', response);
  expect(response.status).toBe(201);
});

// 18. Minimum Length for Names
test('18. Check minimum length requirement for names', async () => {
  const payload = {
    firstName: 'A',
    lastName: 'B',
    phoneNumber: 9876543215,
    emailId: 'short.name@example.com'
  };
  const response = await createUser(payload);
  expect(response.status).toBe(400);
});

// 19. Maximum Length for Email
test('19. Check maximum length for email address', async () => {
  const payload = {
    firstName: 'LongEmail',
    lastName: 'User',
    phoneNumber: 9876543216,
    emailId: `${'a'.repeat(256)}@example.com` // Most systems limit to 254 characters
  };
  const response = await createUser(payload);
  expect(response.status).toBe(400);
});

// 20. Trailing/Leading Spaces in Email
test('20. Handle trailing/leading spaces in email', async () => {
  const payload = {
    firstName: 'Space',
    lastName: 'Email',
    phoneNumber: 9876543217,
    emailId: ' spaceemail@example.com '
  };
  const response = await createUser(payload);
  expect(response.status).toBe(201); // Expecting 201 if spaces are trimmed
});

// 21. HTML Injection Attempt
test('21. Prevent HTML injection in input fields', async () => {
  const payload = {
    firstName: '<script>alert("XSS")</script>',
    lastName: 'User',
    phoneNumber: 9876543218,
    emailId: 'html.injection@example.com'
  };
  const response = await createUser(payload);
  expect(response.status).toBe(400);
});

// 22. Null Values
test('22. Handle null values for required fields', async () => {
  const payload = {
    firstName: null,
    lastName: 'User',
    phoneNumber: 9876543219,
    emailId: 'null.test@example.com'
  };
  const response = await createUser(payload);
  expect(response.status).toBe(400);
});

// 23. Different Content-Type Header
test('23. Test with different Content-Type header', async () => {
  const payload = {
    firstName: 'Content',
    lastName: 'Type',
    phoneNumber: 9876543220,
    emailId: 'content.type@example.com'
  };
  try {
    const response = await axios.post(BASE_URL, payload, {
      headers: {
        'roll-number': ROLL_NUMBER,
        'Content-Type': 'application/xml'
      }
    });
    expect(response.status).toBe(415); // Unsupported Media Type
  } catch (error) {
    expect(error.response.status).toBe(415);
  }
});

// 24. Duplicate First and Last Name
test('24. Create users with duplicate first and last names', async () => {
  const payload1 = {
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: 9876543221,
    emailId: 'john.doe1@example.com'
  };
  await createUser(payload1);
  
  const payload2 = {
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: 9876543222,
    emailId: 'john.doe2@example.com'
  };
  const response = await createUser(payload2);
  expect(response.status).toBe(201); // Expecting 201 as names can be duplicate
});

// 25. Phone Number with Special Characters
test('25. Handle phone number with special characters', async () => {
  const payload = {
    firstName: 'Phone',
    lastName: 'Special',
    phoneNumber: '987-654-3223',
    emailId: 'phone.special@example.com'
  };
  const response = await createUser(payload);
  expect(response.status).toBe(400);
});

// 26. Email with Multiple @ Symbols
test('26. Validate email with multiple @ symbols', async () => {
  const payload = {
    firstName: 'Multiple',
    lastName: 'At',
    phoneNumber: 9876543224,
    emailId: 'multiple@@at.com'
  };
  const response = await createUser(payload);
  expect(response.status).toBe(400);
});

// 27. Extremely Short Roll Number
test('27. Test with extremely short roll number', async () => {
  const payload = {
    firstName: 'Short',
    lastName: 'Roll',
    phoneNumber: 9876543225,
    emailId: 'short.roll@example.com'
  };
  const response = await createUser(payload, '1');
  expect(response.status).toBe(400);
});

// 28. Extremely Long Roll Number
test('28. Test with extremely long roll number', async () => {
  const payload = {
    firstName: 'Long',
    lastName: 'Roll',
    phoneNumber: 9876543226,
    emailId: 'long.roll@example.com'
  };
  const response = await createUser(payload, '1'.repeat(1000));
  expect(response.status).toBe(400);
});

// 29. Non-ASCII Characters in Email
test('29. Handle non-ASCII characters in email address', async () => {
  const payload = {
    firstName: 'NonASCII',
    lastName: 'Email',
    phoneNumber: 9876543227,
    emailId: 'üser@exämple.com'
  };
  const response = await createUser(payload);
  expect(response.status).toBe(400);
});

// 30. Payload with Additional Unexpected Fields
test('30. Send payload with additional unexpected fields', async () => {
  const payload = {
    firstName: 'Extra',
    lastName: 'Fields',
    phoneNumber: 9876543228,
    emailId: 'extra.fields@example.com',
    unexpectedField: 'This is unexpected'
  };
  const response = await createUser(payload);
  expect(response.status).toBe(201); // Expecting 201 if extra fields are ignored
});

 
  
  
  
});