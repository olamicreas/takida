from flask import Flask, render_template, request, redirect, url_for, flash
from flask_mail import Mail, Message
import os
import json

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

# Flask-Mail configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'takidamakeup@gmail.com'
app.config['MAIL_PASSWORD'] = 'xumzbbrrbacnkyvj'
app.config['MAIL_DEFAULT_SENDER'] = app.config['MAIL_USERNAME']
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)

# Load all reviews from JSON file
def load_reviews():
    try:
        with open('reviews.json', 'r') as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return {"approved": [], "pending": []}

# Save the review data to JSON file
def save_reviews(data):
    with open('reviews.json', 'w') as file:
        json.dump(data, file)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/reviews')
def reviews():
    # Only load and display approved reviews
    reviews = load_reviews().get("approved", [])
    return render_template('review.html', reviews=reviews)

@app.route('/send_mail', methods=['POST'])
def send_mail():
    if request.form.get('name') and request.form.get('email'):
        name = request.form['name']
        email = request.form['email']
        subject = request.form['subject']
        
        if subject == 'booking':
            # Handle booking details and send email
            time_date = request.form.get('timeDate')
            location = request.form.get('location')
            desired_look = request.form.get('desiredLook')
            body = f"Booking Details:\nName: {name}\nEmail: {email}\nDate and Time: {time_date}\nLocation: {location}\nDesired Look: {desired_look}"
            msg = Message(subject=f"Booking Request from {name}", recipients=['takidamakeup@gmail.com'])
            msg.body = body
            try:
                mail.send(msg)
                flash("Your booking request was submitted successfully!")
            except Exception as e:
                flash(f"Error sending email: {str(e)}")
                app.logger.error(f"Error sending email: {str(e)}")
                return redirect(request.referrer)
        
        elif subject == 'review':
            # Handle review details and save as pending
            rating = request.form.get('rating')
            job_title = request.form.get('jobTitle')
            review_image = request.form.get('reviewImage')
            message = request.form.get('message', '')

            review_data = {
                "name": name,
                "email": email,
                "rating": rating,
                "job_title": job_title,
                "review_image": review_image,
                "message": message
            }
            
            # Load current reviews and add the new one as pending
            data = load_reviews()
            data["pending"].append(review_data)
            save_reviews(data)
            flash("Your review was submitted and is awaiting approval!")
            msg = Message(subject=f"Review from {name}", recipients=['takidamakeup@gmail.com'])
            body = f"click here to accept or reject the review {'https://takidamakeup.com/admin/review-approval'}"
            msg.body = body
            try:
                mail.send(msg)
                
            except Exception as e:
                flash(f"Error sending email: {str(e)}")
                app.logger.error(f"Error sending email: {str(e)}")
                return redirect(request.referrer)
        
        return redirect(request.referrer)

    return redirect(request.referrer)

# Admin route to approve or reject reviews
@app.route('/admin/review-approval', methods=['GET', 'POST'])
def review_approval():
    data = load_reviews()
    pending_reviews = data.get("pending", [])

    if request.method == 'POST':
        # Get the action and review index
        review_index = int(request.form['review_index'])
        action = request.form['action']

        if action == 'approve':
            # Move review from pending to approved
            approved_review = pending_reviews.pop(review_index)
            data["approved"].append(approved_review)
           
        elif action == 'reject':
            # Remove review from pending
            pending_reviews.pop(review_index)
           

        # Save changes to reviews.json
        data["pending"] = pending_reviews
        save_reviews(data)

    return render_template('review_approval.html', reviews=pending_reviews)

@app.route('/subscribe', methods=['POST'])
def subscribe():
    email = request.form.get('email')
    if email:
        try:
            msg = Message("Subscription Request", recipients=['info@takidamakeup.com'])
            msg.body = f"New subscriber: {email}"
            mail.send(msg)
            flash("Thank you for subscribing!")
        except Exception as e:
            flash("Error sending subscription email. Please try again later.")
            app.logger.error(f"Error sending subscription email: {str(e)}")
            return redirect(request.referrer)

    return redirect(request.referrer)

if __name__ == '__main__':
    app.run(debug=True)
