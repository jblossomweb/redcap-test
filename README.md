# Redcap Test #

The next phase of the process is a sample project. The project consists of an Angular app, back end api, and database. The description of the project is below. Please let me know if you have any questions. This is not an exercise in interpreting requirements, so let’s hop on the phone if any part of this is unclear.
 
“As a system admin, I need to list dealerships, and add a new dealership to the system.”
 
Dealer Listing Page:
Page presents a list of dealerships from the database – name, city, and website. List should be sortable and filterable (client side).
 
Add Dealer Page:
User starts by selecting an address from google places autocomplete. No other fields should be available until the user selects an address from google places. Selected address should have a street address. If an entry is selected that does not include a street address,  communicate invalid selection to the user. For example, the user should not be able to select “Miami, FL.” If the selected address has a valid street address, use the information from Google places to populate the rest of the form. The rest of the form includes the following fields: Name, Address, City, State, Zip, Lat, Lng, Sales Phone Number, Service Phone Number, Website URL. Google may or may not be able to provide all of that information, but populate whatever is available. In addition to those fields, there will also be a dropdown of available Twilio numbers. Use the Twilio API to populate this dropdown, using the “NearLatLng” option along with the Distance option, using the maximum searchable distance. When all fields are filled out (all fields are required), the save button will post data to the back end API and save the Dealer to the database.   The app will return to the listing page, the newly added dealer should show up in the listing page.
 
Client: AngularJS and any other javascript libraries needed. Use open source/third party javascript implementations wherever possible.
UI: Anything. It should be presentable, but the majority of the time should be spent on functionality instead of look and feel.
Server: Any
Database: Any
 
We don’t have to worry about authentication or authorization for this project. You can host it anywhere you’d like. You should be able to sign up for a trial account for Twilio with no cost to you.