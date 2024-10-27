interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  pdfs: {
    name: string;
    originalName: string;
    url: string;
  }[];
}
export default User;
