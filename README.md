# eventCreator
Google calendar event creator using The Silph Road Pokemon tournament page

This is a Google Apps Script project that was created for community that wanted to easily create Google calendar and
Discord channel events from The Silph Road Pokemon tournament pages

This has been written as a standalone script but can easily be attached to a spreadsheet if you so wish.

To se this up, create a new Google Apps Script in Google Drive:
![](/images/image1.png)

Copy the code from Code.gs into the first file that's open.
Change the constants at the top of the code to be your specific IDs
`const SPREADSHEETID = "Insert your spreadsheet ID here";`

`const CALENDARID = "Insert your calendar ID here";`

- The spreadsheet must have a sheet called Sheet1 and be editable by all who are going to run this web app
- If no headers exist in Sheet1 they will be created on first execution of the web app
- The Start and End times columns should be formatted as **Date Time dd/mm/yyyy hh:mm:ss**
- The calendar must be editable by all accounts who are going to run this web app

Create 3 new files (Index.html, JavaScript.html, Stylesheet.html) from **File** -> **New** -> **HTML File**
![](/images/image2.png)

Copy and paste the code from the corresponding files here.

Save all 4 files and name the prject something meaningful

Enable the Calendar API and Google Sheets API by going to **Resources** -> **Advanced Google services** and enable each API on the right

Now publish the web app **Publish** -> **Deploy** as web app and fill in the form
![](/images/image3.png)

The url provided is now the live web app, navigate to this url and go through the authorisation requests
**Review Permissions** -> **Choose your Google account** -> **This app isn't verified** (click advanced and **Go to web app name**) -> 
  Review the permissions required and click **Allow**.

You should now be presented with the web app, get the silph.gg url (e.g. `https://silph.gg/t/tg9r`) and paste it into the text field, click submit
Review the event details and click submit if happy.

The code caters for malformed urls and will only return content from a genuine silph.gg url.
