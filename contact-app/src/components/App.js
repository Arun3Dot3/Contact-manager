import React, { useState, useEffect } from "react";
import uuidv4 from "uuidv4";
import "./App.css";
import Header from "./Header";
import api from "../api/contacts"
import AddContact from "./AddContact";
import ContactList from "./ContactList";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ContactDetails from "./contactDetails";
import EditContact from "./EditAddContact";
function App() {
  const LOCAL_STORAGE_KEY = "contacts";
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResult] = useState([]);
 
  //retriveContact

  const retriveContact = async () => {
    const response = await api.get("/contacts");
    return response.data;
  }





  const addContactHandler = async (contact) => {

    const request = {
      id: uuidv4(),
      ...contact,
    };
    const response = await api.post("/contacts", request);
    setContacts([...contacts, response.data])

  };
  const updateContactHandler = async (contact) => {
    const response = await api.put(`/contacts/${contact.id}`, contact)
    const { id} = response.data;
    setContacts(
      contacts.map((contact) => {
        return contact.id === id ? { ...response.data } : contact ;
      })
    );
  };


  const removeContactHandler = async (id) => {
    await api.delete(`/contacts/${id}`);
    const newContactList = contacts.filter((contact) => {
      return contact.id !== id;
    });

    setContacts(newContactList);
  };




  const searchHandler = (searchTerm) => {
    setSearchTerm(searchTerm);
    if (searchTerm !== "") {
      const newContactList = contacts.filter((contact) => {
        return Object.values(contact)
        .join("")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      });
      setSearchResult(newContactList);
    } else {
      setSearchResult(contacts);
    }

  };

  useEffect(() => {
    // const retriveContacts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    // if (retriveContacts) setContacts(retriveContacts);
    const getAllContact = async () => {
      const allContacts = await retriveContact();
      if (allContacts) setContacts(allContacts);
    };
    getAllContact();
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  return (
    <div className="ui container">
      <Router>

        <Header />

        <Switch>
          <Route
            path="/"
            exact
            render={(props) => (
              <ContactList
                {...props}
               
                contacts={searchTerm.length < 1 ? contacts : searchResults}
                getContactId={removeContactHandler}
                term={searchTerm}
                searchKeyword={searchHandler}
              />
            )}
          />

          <Route
            path="/add"
            component={(props) => (
              <AddContact {...props} addContactHandler={addContactHandler} />
            )}
          />
          <Route
            path="/edit"
            component={(props) => (
              <EditContact {...props} updateContactHandler={updateContactHandler} />
            )}
          />
          <Route path="/contact/:id" component={ContactDetails} />
        </Switch>

        {/* addContactHandler={addContactHandler}
      contacts={contacts} getContactId={removeContactHandler} */}
      </Router>
    </div>
  );
}

export default App;
