const staticText = [ 'Name', 'Dashboard', 'Order by', 'search', 'Name', 'Date Created' ]
const contacts = [
  {Name: 'Bob', 'Date Created': 'Monday 04/10/2021'},
  {Name: 'Alice', 'Date Created': 'Wednesday 01/12/2021'},
]

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
    // Get element by text
    for (let text of staticText) {
      cy.contains(text)
    }
    for (let person of contacts) {
      for (let attribute in person) {
        cy.contains(person[attribute])
      }
    }
  })

  it('Oldest first', function(){

    // Get element by css selector. The get method inherits all document.querySelector's features but returns a cypress object instead of a DOM
    cy.get('select').select('oldest')
    cy.get('[type=\'submit\']').click()

    // // The new page should display oldest
    cy.get('option:selected').contains('oldest')
    cy.get('tbody>*>:nth-child(2)')
      .then( x => x.toArray().map(e => e.innerText) )
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
  })

})
