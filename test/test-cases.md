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



## 2. Add new event, add songs to event and view event details 

| Action                                                       | Expectation                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| From the Events page, click "Add new event"                  | You are shown the add event formular.                        |
| Inspect UI                                                   | There are fields: title, date and set comments.              |
| Click save                                                   | An error should be displayed, as the title is required.      |
| Fill title = "Test event"                                    |                                                              |
| Fill date = next sunday                                      |                                                              |
| Fill comments = "Test comments"                              | Fields should be filled.                                     |
| Click save                                                   | The event is saved and the user is redirected to event page. The title, date and comments are visible. |
| Click Add songs to event                                     | You should see a list of songs. It should be clear that you are adding songs to the event. |
| Search for "Gud"                                             | The songs are ordered by relevance to the word "Gud"         |
| Click the first song                                         | The song details are shown and it is clear that you are adding songs to an event. |
| Click "Add this song to event"                               | A dialog is shown with the event name and date shown along with options to change the key and add comments. |
| Click "Add song"                                             | The song is added and you can see this at the top of the page. You have the option to add another song. |
| Click "Add another song"                                     | You're back to the list of songs                             |
| Click the first song in the list                             | You see the song details                                     |
| Click "Add this song to event"                               | Same as before                                               |
| Change transpose key to +2                                   | The select shows the selected key                            |
| Write comment = "Test song comment"                          | The field is filled                                          |
| Click "Add song"                                             | Same as before                                               |
| Click the "Events" tab and select the event you just created. | You see the event details and the songs you just added. The selected transpose keys and song comments are visible. |



## 3. Print event

| Action                                      | Expectation                                                  |
| ------------------------------------------- | ------------------------------------------------------------ |
| From the event details page, click "Print". | You see the event with all songs, lyrics and chords. After a moment you see the print dialog. |
| Close the print dialog.                     | You can scroll and see the entire set.                       |



## 4. Edit event

| Action                                                       | Expectation                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| From the event page of the newly created event, click the three dots in the top right of the event page. | You see options to edit and delete the event.                |
| Click "Edit event"                                           | You see the event details in the event form.                 |
| Change the title to "My event" and click save.               | You see the event page with the new title.                   |
| Click the three dots next to the first song.                 | You see options to move the song up/down, edit song details and remove the song. |
| Click "Move down"                                            | The song is moved down immediately                           |
| Click "Edit options"                                         | A popup is displayed with transpose key and comment          |
| Change the transpose key to -3 and click save                | The transpose key is changed                                 |
| Click "Remove song"                                          | The song is removed                                          |



## 5. Browse upcoming and past events

| Action                    | Expectation                                                  |
| ------------------------- | ------------------------------------------------------------ |
| Click on the "Events" tab | You see the event that was just created under "Upcoming events" with the correct title and date. |

