const fs = require("fs").promises;
const path = require("node:path");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    console.error("Error reading contacts:", error.message);
    return [];
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((c) => c.id === contactId);
    return contact || null;
  } catch (error) {
    console.error("Error getting contact by ID:", error.message);
    return null;
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((c) => c.id === contactId);

    if (index !== -1) {
      const [removedContact] = contacts.splice(index, 1);
      await fs.writeFile(
        contactsPath,
        JSON.stringify(contacts, null, 2),
        "utf-8"
      );
      return removedContact;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error removing contact:", error.message);
    return null;
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const newContact = { id: uuidv4(), name, email, phone };
    contacts.push(newContact);
    await fs.writeFile(
      contactsPath,
      JSON.stringify(contacts, null, 2),
      "utf-8"
    );
    return newContact;
  } catch (error) {
    console.error("Error adding contact:", error.message);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
