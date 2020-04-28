# eventCreator
Google calendar event creator using The Silph Road Pokemon tournament page

This is a Google Apps Script project that was created for community that wanted to easily create Google calendar and
Discord channel events from The Silph Road Pokemon tournament pages

This has been written as a standalone script but can easily be attached to a spreadsheet if you so wish.

To se this up, create a new Google Apps Script in Google Drive:
![](/images/image1.png)

Copy the code from Code.gs into the first file that's open.
Change the constants at the top of the code to be your specific IDs
**const SPREADSHEETID = "Insert your spreadsheet ID here";
const CALENDARID = "Insert your calendar ID here";**

Create 3 new files (Index.htnl, JavaScript.html, Stylesheet.html) from **File** -> **New** -> **HTML File**
![](/images/image2.png)

Copy and paste the code from the corresponding files here.

Save all 4 files and name the prject something meaningful

Now publish the webapp **Publish** -> **Deploy** as web app and fill in the form
![](/images/image3.png)

The url provided is now the live webapp, navigate to this url and go through the authorisation requests
**Review Permissions** -> **Choose your Google account** -> **This app isn't verified** (click advanced and **Go to webApp name**) -> 
  Review the permissions required and click **Allow**.

You should now be presented with the webapp, get the silph.gg url (e.g. `https://silph.gg/t/tg9r`) and paste it into the text field, click submit
Review the event details and click submit if happy.

The code caters for malformed urls and will only return content from a genuine silph.gg url.
