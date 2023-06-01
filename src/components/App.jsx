import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import { ContactForm } from './ContactForm/ContactForm';
import { ContactList } from './ContactList/ContactList';
import { Header } from './Header/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Filter from './Filter/Filter';
import { Section } from './Section/Section';
import initialContacts from './contacts.json';
import useLocalStorage from 'hooks/useLocalStorage';


// стилі для ToastContainer
const notifyOptions = {
  position: 'bottom-left',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
};
const toastifyOptions = {
  position: 'bottom-left',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
  toastId: 'custom-id-yes',
};

export default function App () {
  const [contacts, setContacts] = useLocalStorage ('contacts', initialContacts)
  const [filter, setFilter] = useState('');

  // додавання нового контакту с забороною додачі однакового
  const addContact = newContact => {
    // робимо порівняння
    const theSameContact = contacts.some(
      ({ name, number }) =>
        name.toLowerCase().trim() === newContact.name.toLowerCase().trim() ||
        number.trim() === newContact.number.trim()
    );
      //  якщо однакрвий виводимо сповіщення
    if (theSameContact) {
      return toast.error(
        `${newContact.name}: is already in contacts`,
        notifyOptions
      );
    }
    //  .В іншому випадку розпиляємо обєкт новий контакт з 
    // новим айді врозпилений старий список контактів
    setContacts(contacts => [{ ...newContact, id: nanoid() }, ...contacts]);
  };

  const deleteContact = contactId => {
    setContacts(contacts.filter(
      contact => contact.id !== contactId)
    );
  };


  const changeFilter = e => {
    setFilter(e.currentTarget.value.toLowerCase().trim());
  };


  // фільтр по назві який золишає те що є в списку контактів
  // по символьно
  const getVisibleContacts = () => {
    // приводимо до регістру
    const normalizedFilter = filter.toLowerCase();
    const filteredContacts = contacts.filter(contact =>
      // порівняння
      contact.name.toLowerCase().trim().includes(normalizedFilter)
    );

    if (normalizedFilter && !filteredContacts.length) {
      toast.warn(`No contacts matching your request`, toastifyOptions);
    }

    return filteredContacts;
  };

  return (
    <>
      <Section title= "Phonebook">
        <ContactForm onAddContact={addContact} />
        {contacts.length > 0 && (
        <>
          <Header title="Contacts" />
          <Filter value={filter} onChange={changeFilter} />
          <ContactList  onDelete={deleteContact} contacts={getVisibleContacts()}/>
          </>
        )}
      </Section>
      <ToastContainer />
    </>
  );
};
