import axios from "axios";
import Constants from "../components/Constants";

const allConstants = Constants()

class AuthService {
  login(email, password) {
    return axios
      .post(allConstants.login, {
        email,
        password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
    location.reload();
  }

  register(username, email, password) {
    return axios.post(allConstants.register + "signup", {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();