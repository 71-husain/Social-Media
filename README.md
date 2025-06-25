 Social Media App — Version 1.0
A modern full-stack social media web application built with Next.js 14, allowing users to post videos (Reels-style) and images (Posts), interact with content using likes, dislikes, and comments, and view a mixed feed like Instagram or Facebook.

🚀 Features
🎞️ Reels Section – Videos that autoplay one at a time and scroll like Instagram reels

🖼️ Post Section – Static image posts with captions and user info

❤️ Like / 👎 Dislike on both videos and posts

💬 Comment system with real-time UI updates

🏠 Home Feed – A unified feed of posts and reels sorted by latest

🔐 Authentication system (Email-based, Google login coming soon)

🛠️ Tech Stack
Frontend: Next.js (App Router), TypeScript, TailwindCSS, Lucide Icons

Backend: Node.js, Next.js API Routes, MongoDB (via Mongoose)

Auth: NextAuth.js

Cloud Storage: ImageKit for video/image uploads and CDN support

Deployment: Vercel (Optional for live hosting)

📸 Screenshots
home page

![image](https://github.com/user-attachments/assets/e55b753c-46d9-4f63-9576-55e93e5807e0)

reeks section 
![image](https://github.com/user-attachments/assets/fa63cfd9-76db-4206-a42e-eeca00c1c8ae)

comment section 
![image](https://github.com/user-attachments/assets/7daabc97-e867-45db-af8b-0d4fe58090af)





🧪 Running Locally
# Clone the repository
git clone https://github.com/your-username/social-media-app.git
cd social-media-app

# Install dependencies
npm install

# Add your environment variables
touch .env.local
# Add MongoDB URI, ImageKit keys, and NextAuth secrets

# Start the dev server
npm run dev

🌱 Upcoming Features (v2 Roadmap)
👤 User profile page with uploaded posts and reels

🔔 Notification system (likes, comments)

🔐 Google Authentication via NextAuth

🧠 Explore / Suggested content feed

📄 Reusable toast error handler (like “Login to like”)

📱 Responsive mobile-friendly layout improvements

📁 Folder Structure

/app
  /components       // Reusable UI like VideoCard, PostCard, CommentCard
  /api              // API calls to server
  /(auth)           // Auth-related pages
  /(user)           // User pages like Upload, Profile
/models             // Mongoose schemas
/lib                // Database and auth helpers
🙌 Author
Husain Ansari
GitHub: @71-husain
Email: ansarihusain9510@gmail.com

📄 License
This project is open source and free to use.

