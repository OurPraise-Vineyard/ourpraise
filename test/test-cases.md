# Test cases

[TOC]



## 1. Login to OurPraise

| Action                                                       | Expectation                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Go to your local OurPraise.                                  | You should see the login page: location selector, username and password fields and a login button. There should be no option to register. |
| Select the location dropdown                                 | You should see "Aarhus" and "Roskilde" as locations available. |
| Enter "example" in the username field and click the login button. | You should see a message indicating that the password is missing. |
| Enter "password" in the password field and click the login button. | You should see an error indicating that username should be a valid email address. |
| Replace the username with "example@ourpraise.dk"             | You should see an error indicating that the username or password does not exist. |
| Login with username: "test@ourpraise.dk" and password: "ourpraise123" instead. | You should now be logged in.                                 |



## 2. Browse upcoming and past events

## 3. Add new event



Add songs:

Add one without comment or transpose

Add one with transpose

Add one with transpose and comment

## 4. View event details

## 5. Edit event

## 6. Print event

## 7. Browse songs and search

## 8. Add new song

## 9. View song details and transpose

