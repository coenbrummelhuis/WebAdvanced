import express from 'express';
import cors from 'cors';
import auth from './routes/auth.js';
import books from "./routes/books.js";
import users from "./routes/users.js";
import checkAcceptHeader from "./middleware/check-accept-header.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(checkAcceptHeader);

app.use("/auth", auth);
app.use("/users", users)
app.use('/books', books);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({message: err.message || 'Something went wrong'});
});

app.listen(port, () => {
  console.log(`Web Advanced backend listening on port ${port}`);
});