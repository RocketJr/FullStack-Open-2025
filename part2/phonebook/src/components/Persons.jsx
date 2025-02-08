const Persons = ({ personsToShow, handleDelete }) => {
  return (
    <div>
      {personsToShow.map(person =>
        <Person key={person.id} person={person} handleDelete={handleDelete} />
      )}
    </div>
  )
}
  
const Person = ({ person, handleDelete }) => {
  return (
    <p>
      {person.name} {person.number} <button onClick={() => handleDelete(person.id)}>delete</button>
    </p>
  )
}

export default Persons