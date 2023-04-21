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

  // Load email content
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {

    const fields = ["sender", "recipients", "subject", "timestamp", "body"];

    fields.forEach(field => {
      const element = document.createElement('div');
      element.innerHTML = `${field}: ${email[field]}<hr>`;
      document.querySelector('#email-view').append(element);
    })

    // Create archive/unarchive button
    const archive_element = document.createElement('div');
    let archive_action = true;
    if (email["archived"] == false) {
      archive_element.innerHTML = '<button id="archive-button">Archive</button><hr>';
      archive_action = true;
    } else {
      archive_element.innerHTML = '<button id="archive-button">Unarchive</button><hr>';
      archive_action = false;
    }
    document.querySelector('#email-view').append(archive_element);

    // Create reply button
    const reply_element = document.createElement('div');
    reply_element.innerHTML = '<button id="reply-button">Reply</button><hr>';
    document.querySelector('#email-view').append(reply_element);

    // Change archive status on click and load inbox
    const archive_button = document.getElementById("archive-button");
    archive_button.addEventListener('click', function() {
      fetch(`/emails/${email_id}`, {
        method: 'PUT',
        body: JSON.stringify({
          archived: archive_action
        })
      });
      load_mailbox('inbox');
      location.reload(); // refreshes page to ensure mailbox page content is up to date
    });

    // Load composition form and pre-fill with information
    const reply_button = document.getElementById("reply-button");
    reply_button.addEventListener('click', function() {
      const original_sender = email["sender"];
      const original_subject = email["subject"];
      const original_timestamp = email["timestamp"];
      const original_body = email["body"];

      reply(original_sender, original_subject, original_timestamp, original_body);

    });

  });

  // Update read status
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  });
}

function reply(original_sender, original_subject, original_timestamp, original_body) {

  // Prevents duplicate instances of 'Re:' in subject
  let new_subject_prefix = '';
  if (original_subject.split(' ',1)[0] != "Re:") {
    new_subject_prefix = 'Re: ';
  }

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = original_sender;
  document.querySelector('#compose-subject').value = `${new_subject_prefix}${original_subject}`;
  document.querySelector('#compose-body').value = `On ${original_timestamp} ${original_sender} wrote: ${original_body}`;

}