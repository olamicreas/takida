from flask import Flask, render_template, request, redirect, url_for, flash
from flask_mail import Mail, Message
import os

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'
# Flask-Mail configuration
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')  # Your email here
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')  # Your email password here
app.config['MAIL_DEFAULT_SENDER'] = app.config['MAIL_USERNAME']
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/send_mail', methods=['POST'])
def send_mail():
    # Handle contact form
    if request.form.get('name') and request.form.get('email'):
        name = request.form['name']
        email = request.form['email']
        subject = request.form['subject']
        message = request.form.get('message', '')

        # Custom fields based on subject
        if subject == 'booking':
            time_date = request.form.get('timeDate')
            location = request.form.get('location')
            desired_look = request.form.get('desiredLook')
            body = f"Booking Details:\nName: {name}\nEmail: {email}\nDate and Time: {time_date}\nLocation: {location}\nDesired Look: {desired_look}"
        else:
            body = f"Review from {name}:\n\n{message}"

        # Sending email
        try:
            msg = Message(subject=f"{subject.capitalize()} Request from {name}", recipients=['takidamakeup@gmail.com'])
            msg.body = body
            mail.send(msg)
            flash("Your form was submitted successfully!")
        except Exception as e:
            flash(f"Error sending email: {str(e)}")  # Display the error message
            app.logger.error(f"Error sending email: {str(e)}")  # Log the error
            return redirect(request.referrer)
       
        return redirect(request.referrer)

    return redirect(request.referrer)

# For handling the subscription form
@app.route('/subscribe', methods=['POST'])
def subscribe():
    email = request.form.get('email')
    if email:
        try:
            msg = Message("Subscription Request", recipients=['takidamakeup@gmail.com'])
            msg.body = f"New subscriber: {email}"
            mail.send(msg)
            flash("Thank you for subscribing!")  # Success message
        except Exception as e:
            flash("Error sending subscription email. Please try again later.")  # User-friendly error message
            app.logger.error(f"Error sending subscription email: {str(e)}")  # Log error for debugging
           
            return redirect(request.referrer)

    return redirect(request.referrer)

if __name__ == '__main__':
    
    app.run(debug=True)
