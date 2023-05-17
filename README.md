# Mail

## Requirements

Design a front-end for an email client that makes API calls to send and receive emails. This should be completed in the form of a single-page application.

* **Send Mail:** When a user submits the email composition form, send the email to recipients and load the user's sent mailbox.
* **Mailbox:** When a user visits their Inbox, Sent mailbox, or Archive, load the appropriate mailbox. Each email should then be rendered in its own box that displays who the email is from, what the subject line is, and the timestamp of the email. If the email is unread, it should appear with a white background. If the email has been read, it should appear with a grey background.
* **View Email:** When a user clicks on an email, the user should be taken to a view where they see the content of that email, and the status should be changed to 'read'. 
* **Archive:** When viewing an Inbox email, the user should be presented with a button that lets them archive the email. When viewing an Archive email, the user should be presented with a button that lets them unarchive the email. This requirement does not apply to emails in the Sent mailbox.
* **Reply:** When viewing an email, the user should be presented with a “Reply” button that lets them reply to the email. When the user clicks the “Reply” button, they should be taken to the email composition form, with the recipeient field and subject line pre-filled based on the original email.
   
## Preview

https://github.com/brandon-prescott/mail/assets/108699186/bfc9df16-07e4-4a27-9de0-aa48822049ca

## Installation

To set up this project on your computer:
1. Download this project
    ```
    git clone https://github.com/brandon-prescott/mail.git
    ```
2. Navigate to the commerce directory
    ```
    cd mail
    ```
3. Install all necessary dependencies
    ```
    pip install -r requirements.txt
    ```
4. Make migrations
    ```
    python3 manage.py makemigrations
    ```
5. Migrate
    ```
    python3 manage.py migrate
    ```

