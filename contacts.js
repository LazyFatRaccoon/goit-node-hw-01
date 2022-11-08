import fs from "fs";
import path from "path";
import "colors";
const fsPromises = fs.promises;

import { v4 as uuidv4 } from "uuid";

const contactsPath = path.resolve("./db/contacts.json");

export function listContacts() {
  fsPromises
    .readFile(contactsPath, "utf8")
    .then((data) => console.table(JSON.parse(data)))
    .catch((error) => console.error(error));
}

export function getContactById(contactId) {
  fs.readFile(contactsPath, "utf8", (error, data) => {
    if (error) {
      console.log("can't read from file".red);
    }
    const response = JSON.parse(data).filter(
      (contact) => contact.id === contactId.toString()
    );

    response.length === 0
      ? console.log("Can't find this contact".red)
      : console.log(response);
  });
}

export const removeContact = (contactId) => {
  fsPromises
    .readFile(contactsPath, "utf8")
    .then((data) => {
      const newData = JSON.parse(data).filter(
        (contact) => contact.id !== contactId.toString()
      );
      newData.length === JSON.parse(data).length
        ? console.log("Can't find this contact".red)
        : fsPromises
            .writeFile(contactsPath, JSON.stringify(newData))
            .then(console.log("Deleted successfully".green));
    })
    .catch((error) => console.error(error));
};

export const addContact = async (name, email, phone) => {
  const newData = await fsPromises
    .readFile(contactsPath)
    .then((data) => [
      ...JSON.parse(data),
      { id: uuidv4(), name, email, phone },
    ]);
  fsPromises
    .writeFile(contactsPath, JSON.stringify(newData))
    .then(console.log("Contact was added successfully".green));
};
