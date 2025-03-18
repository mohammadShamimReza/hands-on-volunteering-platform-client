<p align="center">
  <img src="https://res.cloudinary.com/dqwnzs85c/image/upload/v1742302188/logo_lktt4p.png" alt="Logo" width="100">

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

</p>


# Project Title

A community-driven social volunteering platform that connects individuals with meaningful social impact opportunities. Users can discover and join volunteer-driven events, post requests for community help, form teams for large-scale initiatives, and track their impact with contributions logged on a personal and team level.




## Tech Stack

**Client:** Next.js, Redux, TailwindCSS

**Database:** PostgreSQL(prisma)

**Authentication:** JWT-based auth

**API Communication:** REST API

**Deployment:** Vercel, cloudinary(image)






## 🚀 Features

### 1️⃣ User Registration & Profile Management
- Secure sign-up and login with email and password
- Users can edit their profiles, list their skills, and select causes they support
- Volunteer history and contributions are visible in the user dashboard

### 2️⃣ Discover & Join Volunteer Events
- Users or organizations can create events with details like title, description, date, time, and location
- Public event feed with category, location, and availability filters
- One-click event registration for instant participation
- Events and community help posts are differentiated

### 3️⃣ Community Help Requests
- Users or organizations can post help requests
- Other users can offer help via comments.
- Requests have urgency levels (Low, Medium, Urgent) for better prioritization

### 4️⃣ Form Teams & Group Initiatives
- Users can create **private** (invite-only) or **public** (open-for-all) teams
- Team dashboards show members, events.
- A leaderboard highlights the most active teams

### 5️⃣ Impact Tracking & Social Recognition
- Users log volunteer hours after attending events
- Users earn points (5 points per hour) and receive auto-generated certificates at milestones (20, 50, 100 hours)
- Public leaderboard ranks the most active volunteers



## Run Locally

Clone the project

```bash
  git clone git@github.com:mohammadShamimReza/hands-on-volunteering-platform-client.git
```

Go to the project directory

```bash
  cd hands-on-volunteering-platform-client
```

Install dependencies

```bash
  npm install
```


Start the server

```bash
  npm run dev
```



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NEXT_PUBLIC_BACKEND_URL=[Your server site port/api/v1]`

`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=[your cloudinary name]`

`NEXT_PUBLIC_CLOUDINARY_API_KEY=[your cloudinary api key]`

`NEXT_PUBLIC_CLOUDINARY_API_SECRET=[your cloudinary api secret]`


## Authors

- [shamimReza](https://github.com/mohammadShamimReza)




## Server

[Code](https://github.com/mohammadShamimReza/hands-on-volunteering-platform-server)



