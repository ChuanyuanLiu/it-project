## Systems Tested on

* Python 3.9+
* Firefox 90+
* Cypress 8.4.1

## To run

1. `python server.py`
2. Access `localhost:3000` using any browser
3. npm install
4. npx cypress open

## Client's Requirement
- The client uses an iPhone 6
- The client wants a simple dashboard to display a list of contacts that can be sorted by date created and searched by names.

## User Stories

**contact list Epic**
- As a user
  - I want to see everyone in my contact list, so that I don't forget people's names.
  - I want to sort contacts by the date I meet them, so I can group together those I meet on the same day.
  - I want to search contacts by names, so I can quickly find a perons.

## Acceptance Criteria

- Given, I'm on the index page
  - After it loads, I can see a list of contacts.
  - When I switch using the <kbd>Order by</kbd> dropdown, the contacts will be sorted chronologically ascending or descending.
  - When I search for a user, the list filter outs all users with names matching the searched text.
