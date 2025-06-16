# 🧑‍🎓 Student Progress Management System (SPMS)

A full-stack web application to help track and visualize student progress in competitive programming, with real-time Codeforces integration. Built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).

---

## 🚀 Features

- ✅ **Student Dashboard** to view personalized profiles  
- 📊 **Codeforces Integration** to sync ratings, submissions, and contest history  
- 🏫 Admin panel to **add/edit/delete students**  
- 🔍 Filter/search students by name, college ID, or tags  
- 📈 Weekly/Monthly analytics and progress charts *(planned)*  
- 🔐 Secure routes using JWT authentication *(planned)*  

---

## 📸 Preview

[![Watch Demo](https://img.icons8.com/fluency/48/youtube-play.png)](https://drive.google.com/file/d/1R46j476r710GPL2pZjZ5eF9K4FcfjNQH/view?usp=sharing)

[Click here to watch the demo](https://drive.google.com/file/d/1R46j476r710GPL2pZjZ5eF9K4FcfjNQH/view?usp=sharing)

> *Coming soon: UI mockups and preview GIFs*

---

## 🛠️ Tech Stack

| Tech        | Description                      |
|-------------|----------------------------------|
| **MongoDB** | NoSQL database for storing users, stats |
| **Express** | Backend API framework            |
| **React.js**| Frontend interface (with Tailwind)|
| **Node.js** | Runtime for backend               |
| **Axios**   | For REST API calls (esp. to Codeforces API) |

---

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/spms.git
cd spms
```

2. **Backend Setup**

```bash
cd backend
npm install
npm run dev
```

3. **Frontend Setup**

```bash
cd frontend
npm install
npm start
```

4. **Environment Variables**

Create a `.env` file in the `backend` folder with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

---

## 🔄 Codeforces Sync

- The system fetches data using Codeforces API.
- Students must add their Codeforces handle in the form.
- API hits:
  - `/user.info` – for rating
  - `/user.status` – for submission logs

> ⚠️ Avoid abuse of Codeforces API — rate limiting is handled manually (or can be improved with caching).

---

## 🗃️ Folder Structure

```
spms/
├── server(Backend)/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── utils/
├── client(Frontend)/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
```

---

## 🧩 Planned Features

- 📅 Weekly problem goals  
- 🔔 Notification system for updates  
- 🧠 Problem recommendations  
- 📤 Export student reports (PDF, Excel)  
- 👨‍🏫 Teacher/mentor view with student grouping  

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you would like to change.

---

## 📄 License

MIT License

---

## 👨‍💻 Author

- **Pritam Chakraborty**  
[Portfolio](https://personal-portfolio-dun-beta.vercel.app/) | [LinkedIn](https://www.linkedin.com/in/pritam-chakraborty-0b74b4243/) | [GitHub](https://github.com/rahulisbusy)
