# TEST CASES

# Single shift test suite

1. Create a single shift sucesfully: (AUTOMATED)
   STEPS: - Navigate to shifts on the sidemenu (Werkstattplanung > Schichten) - Click the bottom-right action button
   ~ expect side action form to show - Fill the action form for a single shift (data: vorlage, mitarbeiter, datum, endzeit) - Click 'Speichern' button to create the shift and store the created shift-id for upcoming verifications
   ~ expect /graphql api call to create shift is ok (status 200/201)
   ~ expect shift to shown in UI with correct data (vorlage, mitarbeiter, datum, endzeit)

2. Verify shift details (test 1 should run prior to this test)
   STEPS: - Click on the shift (or double-click - whatever action shows the aside details form)
   ~ expect aside details form to show
   ~ expect title, desc, vorlage, mitarbeiter, datum, endzeit are correct (check against the api response or against the data used to create the shift in test1), verify the timestamp on history-tab

3. Update shift details
   STEPS: - Open aside form with shift details - Change data (vorlage, mitarbeiter, datum, endzeit)
   ~ expect form is populated with new data - Click 'Speichern' button to update the shift
   ~ expect /graphql api call to be ok (status 201/200)
   ~ expect the shift card to have updated data in UI

4. Delete shift
   STEPS: - Open aside form with shift details - Click on 'Löschen' button
   ~ expect aside form to close
   ~ expect /grapql delete api to be ok (status 200)
   ~ expect shift card not to show in UI

5. Shift cannot be created if required data is missing

#

# Recurring shift with set period test suite

1. Create a recurring shift within a 6 months period (or whatever period)
2. Verify shift details (verify is recurring for the period specified)
3. Update single shift
4. Update recurring shift
5. Delete single shift
6. Delete all recurring shifts (cleanup)

#

# Recurring shift with infinite period test suite

1. Create a recurring shift with infinite period (and verify it's creation)
2. Verify shift is recurring for 1 year and delete test

#
