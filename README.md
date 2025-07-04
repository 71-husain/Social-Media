# Social Media App — Version 1.0
A modern full-stack social media web application built with Next.js 14, allowing users to post videos (Reels-style) and images (Posts), interact with content using likes, dislikes, and comments, and view a mixed feed like Instagram or Facebook.

# 🚀 Features
🎞️ Reels Section – Videos that autoplay one at a time and scroll like Instagram reels

🖼️ Post Section – Static image posts with captions and user info

❤️ Like / 👎 Dislike on both videos and posts

💬 Comment system with real-time UI updates

🏠 Home Feed – A unified feed of posts and reels sorted by latest

🔐 Authentication system (Email-based, Google login coming soon)

# 🛠️ Tech Stack
Frontend: Next.js (App Router), TypeScript, TailwindCSS, Lucide Icons

Backend: Node.js, Next.js API Routes, MongoDB (via Mongoose)

Auth: NextAuth.js

Cloud Storage: ImageKit for video/image uploads and CDN support

Deployment: Vercel (Optional for live hosting)

# 📸 Screenshots
home page


<img width="164" alt="image" src="https://github.com/user-attachments/assets/e99c65f6-5a63-46a7-ac25-7188095043d4" />

reeks section 

<img width="167" alt="image" src="https://github.com/user-attachments/assets/28b08c57-9b4b-4fed-91c1-09d1cbab54cf" />

comment section 

<img width="163" alt="image" src="https://github.com/user-attachments/assets/a3ae1ca2-0d7b-4a9c-8ff4-914178eb3836" />





🧪 Running Locally
Follow the steps below to run the project on your local machine:

1. Clone the repository

git clone https://github.com/your-username/social-media-app.git
cd social-media-app
2. Install dependencies
bash
Copy
Edit
npm install
3. Set up environment variables
Create a .env.local file in the root directory:

bash
Copy
Edit
touch .env.local
Then add the following variables inside .env.local:

<pre> ``` git clone https://github.com/your-username/social-media-app.git cd social-media-app ```</pre>


Now visit http://localhost:3000 in your browser.


# 🌱 Added Features in version 2

- 👤 Follow / Unfollow Users  
  Users can now follow or unfollow other users from their profile pages.
  <img width="169" alt="image" src="https://github.com/user-attachments/assets/6786e74d-4bb8-492e-80d4-4cd6290439bc" />


- 📄 Public & Own Profile Pages  
  - **Own Profile** shows personal posts, reels, and user info  
  - **Public Profiles** are viewable by others with follow functionality
  - <img width="169" alt="image" src="https://github.com/user-attachments/assets/82c97358-2a0e-430e-a5ac-5bdc403c2bae" />
  <img width="176" alt="image" src="https://github.com/user-attachments/assets/4292a432-873c-442c-8326-5f87b16d83f0" />



# - 🔐 Google Authentication  
  Users can sign in with their Google accounts via NextAuth integration.
  <img width="166" alt="image" src="https://github.com/user-attachments/assets/596f0718-de1e-408c-b73e-30224cab65d9" />



- 🌈 Visual Toast Notifications  
  Success and error messages are now shown via React Hot Toast.

  
🙌 Author

# Husain Ansari

GitHub: @71-husain

Email: ansarihusain9510@gmail.com

📄 License
This project is open source and free to use.

