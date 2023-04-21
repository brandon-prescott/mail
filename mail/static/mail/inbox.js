document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').onsubmit = send_email;

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3><hr>`;

  // Show mailbox content
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    emails.forEach(email => {
      const email_element = document.createElement('div');
      email_element.innerHTML = `${JSON.stringify(email)}<hr>`;

      if (email["read"] == true) {
        email_element.style.backgroundColor = 'whitesmoke';
      } else {
        email_element.style.backgroundColor = 'white';
      }

      email_element.addEventListener('click', function() {
        const email_id = email["id"];
        load_email(email_id);
      });
      document.querySelector('#emails-view').append(email_element);
    });
  });

}

function send_email() {

  // Get form data
  const recipients = document.querySelector('#compose-recipients').value
  const subject = document.querySelector('#compose-subject').value
  const body = document.querySelector('#compose-body').value
  // POST data to emails route
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  // Redirect to sent box or display error
  .then(response => response.json())
  .then(result => {
    if ("message" in result) {
      load_mailbox('sent')
    }
    if ("error" in result) {
      document.querySelector('#compose-error').innerHTML = result['error'];
    }
  });
  return false;
}

function load_email(email_id) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Clear previous email content and display archive button
  document.querySelector('#email-view').innerHTML = '';
  const archive_element = document.createElement('div');
  archive_element.innerHTML = '<button id="archive-button">Archive</button><hr>';
  document.querySelector('#email-view').append(archive_element);

  const archive_button = document.getElementById("archive-button");
  archive_button.addEventListener('click', function() {
    console.log("Button clicked!");
  });

  // Load email content and set status to read
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {

    const fields = ["sender", "recipients", "subject", "timestamp", "body"];

    fields.forEach(field => {
      const element = document.createElement('div');
      element.innerHTML = `${field}: ${email[field]}<hr>`;
      document.querySelector('#email-view').append(element);
    })
  });

  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  });
}