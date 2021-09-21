/// <reference types="Cypress" />
const contacts = [
	{Name: 'Bob', 'Date Created': 'Monday 04/10/2021'},
	{Name: 'Alice', 'Date Created': 'Wednesday 01/12/2021'},
]

// a helper 
function parseDate(string) {
	const dates = string.split(' ')[1].split('/')
	const year = dates[2]
	const month = dates[1]
	const day = dates[0]
	return Date.parse(`${year}-${month}-${day}`)
}

describe('contact-list', function(){

	// run before each `it`
	beforeEach(function() {
		cy.viewport('iphone-6')
		cy.visit('localhost:3000')
	})

	// This is a display test to check if all elements are visible
	it('Contacts are visible', function(){

		// Get element by text not a good way
        const staticText = [ 'Name', 'Order by', 'search', 'Name', 'Date Created' ]
		for (let text of staticText) {
			cy.contains(text)
		}

		// a better uses cy-data which prevents the mapping between object type and the item being tested
		for (const value of ['header', 'name-input', 'name-label', 'order-label', 'order-input', 'submit-button']) {
			cy.get(`[cy-data="${value}"]`)
		}

		// use within to limit the search to it's children
		cy.get('table').within( () =>  {
			for (let person of contacts) {
				for (let attribute in person) {
					cy.contains(person[attribute])
				}
			}
		})

	})

	// the aysnc await isn't supported in Cypress, or at least to my knowledg
    // remove .skip to run it
	it.skip('Oldest first bad implementation', async function(){

		// Get element by css selector. The get method inherits all document.querySelector's features but returns a cypress object instead of a DOM
		cy.get('select').select('oldest')
		cy.get('[type=\'submit\']').click()

		// The new page should display oldest
		const rows = await cy.get('tbody>*>:nth-child(2)')
		const rows_text = rows.map( e => e.innerText)
		const rows_seconds = rows_text.map( parseDate )
		expect([...rows_seconds].sort()).to.deep.equal(rows_seconds)

	})

	it('Oldest first good implementation', function(){

		// Get element by css selector. The get method inherits all document.querySelector's features but returns a cypress object instead of a DOM
		cy.get('select').select('oldest')
		cy.get('[type=\'submit\']').click()

		// The new page should display oldest
		cy.get('option:selected').contains('oldest')
		cy.get('tbody>*>:nth-child(2)')
			.then( x => x.toArray().map(e => parseDate(e.innerText)) )
			.then( (values) => {
				expect([...values].sort()).to.deep.equal(values)
			})
	})

	it('Latest first', function(){

		// // Select latest
		cy.get('select').select('latest')
		cy.get('[type="submit"]').click()

		// The new page should display latest
		// the text inside options can't be lookedup using contrl+f thus we have to use the get method
		cy.get('option:selected').contains('latest')
		cy.get('tbody>*>:nth-child(2)')
			.then( x => x.toArray().map(e => parseDate(e.innerText)) )
			.then( (values) => {
				expect([...values].sort().reverse()).to.deep.equal(values)
			})
	})

	it('Search user', function(){
			cy.get('[type="text"]').type("Rambo")
			cy.get('[type="submit"]').click()
			cy.get('tbody').within(() => cy.contains("Rambo"))
	})

	it('Malformed url', function(){
		cy.visit('localhost:3000/192=xds?1xx')
		cy.visit('localhost:3000')
	})

})
