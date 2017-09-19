function ContactManager(options) {
  this.$name = options.$name;
  this.$email = options.$email;
  this.$addButton = options.$add;
  this.$search = options.$search;
  this.$gridButton = options.$grid;
  this.$listButton = options.$list;
  this.$container = options.$container;
}

ContactManager.prototype.emailRegex = /^[a-z0-9_\.]{2,25}@[a-z0-9]{2,15}\.[a-z]{2,3}$/i; // accepts xx@yyyyy.zzz

ContactManager.prototype.initialize = function() {
  this.deleteButton = '[data-id="deleteButton"]';
  this.view = 'grid'; // initially grid view
  this.contacts = [];
  this.filteredContacts = [];

  this.bindEvents();
};

ContactManager.prototype.bindEvents = function() {
  this.bindClickEvent();
  this.bindSearchEvent();
};

ContactManager.prototype.bindClickEvent = function() {
  var _this = this;
  this.$addButton.on('click', this.handleAddEvent() );

  // delegate to all delete buttons
  this.$container.on( 'click', this.deleteButton, this.handleDeleteEvent() );

  this.$gridButton.on('click',  this.handleChangeViewEvent() );
  this.$listButton.on('click',  this.handleChangeViewEvent() );
};

ContactManager.prototype.bindSearchEvent = function() {
  var _this = this;
  this.$search.on('keyup', function() {
    _this.handleSearchEvent();
  });
};

ContactManager.prototype.handleSearchEvent = function() {
  this.filterContacts();
  this.showContacts();
};

ContactManager.prototype.handleAddEvent = function() {
  var _this = this;
  return function() {
    _this.addContact();
    _this.clearData(); // clear previous data
    _this.filterContacts();
    _this.showContacts();
  }
};

ContactManager.prototype.handleDeleteEvent = function(contactId) {
  var _this = this,
      contactId = '';

  return function() {
    contactId = $(this).data('contactId');
    _this.deleteContact(contactId);
    _this.filterContacts();
    _this.showContacts();
  }
};

ContactManager.prototype.handleChangeViewEvent = function() {
  var _this = this;
  return function() {
    _this.view = $(this).data('id');
    _this.filterContacts();
    _this.showContacts();
  }
};

ContactManager.prototype.addContact = function() {
  var isValidData = this.validateData(),
      isUniqueEmail = '';
      contact_data = '';

  if (isValidData) {
    // check unqiue email only when data is valid
    isUniqueEmail = this.ValidateUniqueEmail();

    if (isUniqueEmail) {
      contact_data = {
        id: this.contacts.length + 1,
        name: this.contactName,
        email: this.contactEmail
      };
      this.contacts.push(new Contact(contact_data));
    } else {
      alert("Email already in use");
    }

  } else {
    alert("Please enter valid data");
  };
};

ContactManager.prototype.showContacts = function() {
  if (this.view === 'list') {
    this.showContactsInListView();
  } else {
    this.showContactsInGridView();
  }
};

ContactManager.prototype.showContactsInGridView = function() {
  this.$container.empty();

  var documentFragment = document.createDocumentFragment(),
      $contactContainer = '',
      $contactName = '' ,
      $contactEmail = '' ,
      $deleteButton = '' ;

  $.each(this.filteredContacts, function() {
    $contactContainer = $('<div>').addClass('contact'),
    $contactName = $('<p>').text("Name: " + this.name);
    $contactEmail = $('<p>').text("Email: " + this.email);
    $deleteButton = $('<button>', {'data-id': "deleteButton", 'data-contact-id': this.id})
                                                              .text('DELETE')
                                                              .addClass('delete');

    $contactContainer.append($contactName, $contactEmail, $deleteButton);
    documentFragment.append($contactContainer[0]);
  });

  this.$container.append(documentFragment);
};

ContactManager.prototype.showContactsInListView = function() {
  this.$container.empty();

  var documentFragment = document.createDocumentFragment(),
      $list = $('<table>').addClass('list');
      $contactContainer = '',
      $contactName = '',
      $contactEmail = '',
      $deleteButtonContainer = '',
      $deleteButton = '' ;

  $.each(this.filteredContacts, function() {
    $contactContainer = $('<tr>'),
    $contactName = $('<td>').text(this.name).addClass('listElement');
    $contactEmail = $('<td>').text(this.email).addClass('listElement');
    $deleteButtonContainer = $('<td>').addClass('listElement');
    $deleteButton = $('<button>', {'data-id': "deleteButton", 'data-contact-id': this.id})
                                                              .text('DELETE')
                                                              .addClass('delete');

    $deleteButtonContainer.append($deleteButton);
    $contactContainer.append($contactName, $contactEmail, $deleteButtonContainer);
    $list.append($contactContainer);
    documentFragment.append($list[0]);
  });

  this.$container.append(documentFragment);
};

ContactManager.prototype.validateData = function() {
  this.contactName = this.$name.val().trim();
  this.contactEmail = this.$email.val().trim();

  if (this.contactName.length === 0 || this.contactEmail.length === 0) {
    return false;
  }

  return this.emailRegex.test(this.contactEmail);
};

ContactManager.prototype.ValidateUniqueEmail = function() {
  var isUniqueEmail = true,
      _this = this;

  $.each(this.contacts, function() {
    if (this.email === _this.contactEmail) {
      isUniqueEmail = false;
      return; // to break out of loop
    }
  });

  return isUniqueEmail;
};

ContactManager.prototype.clearData = function() {
  this.$name.val('');
  this.$email.val('');
  this.$search.val('');
};

ContactManager.prototype.deleteContact = function(contactId) {
  this.contacts = this.contacts.filter(function(contact) {
    if (contact.id != contactId) {
      return true;
    }
  });
};

ContactManager.prototype.filterContacts = function() {
  var _this = this;
  this.filteredContacts = [];
  this.searchText = this.$search.val();

  $.each(this.contacts, function() {
    if (this.name.indexOf(_this.searchText) !== -1) {
      _this.filteredContacts.push(this);
    }
  });
};

//starts ------------------
$(function() {
  var options = {
    $name: $('[data-id="name"]'),
    $email: $('[data-id="email"]'),
    $add: $('[data-id="add"]'),
    $search: $('[data-id="search"]'),
    $container: $('[data-id="contact-container"]'),
    $grid : $('[data-id="grid"]'),
    $list : $('[data-id="list"]'),
  },
     contactManager = new ContactManager(options);
  contactManager.initialize();
});
